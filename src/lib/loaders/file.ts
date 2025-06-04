import type { Turn, Action, Position } from "$lib/types/index.js";

export async function fileLoader(files: File[]): Promise<Turn[]> {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  const turnsMap = new Map<string, Partial<Turn>>();
  let trajectoryFolder = "";

  // Find trajectory folder
  for (const file of files) {
    const pathParts = (file.webkitRelativePath || file.name).split("/");
    if (pathParts.length >= 2 && pathParts[1].startsWith("turn_")) {
      trajectoryFolder = pathParts[0];
      break;
    }
  }

  if (!trajectoryFolder) {
    throw new Error("Could not find valid trajectory folder with turn_XXX subfolders");
  }

  // Process files
  for (const file of files) {
    const filePath = file.webkitRelativePath || file.name;
    const pathParts = filePath.split("/");

    if (
      pathParts.length < 3 ||
      pathParts[0] !== trajectoryFolder ||
      !pathParts[1].startsWith("turn_")
    ) {
      continue;
    }

    const turnName = pathParts[1];
    const fileName = pathParts[pathParts.length - 1];

    if (!turnsMap.has(turnName)) {
      const turnIndex = parseInt(turnName.match(/\d+/)?.[0] || "0");
      turnsMap.set(turnName, {
        id: turnName,
        index: turnIndex,
        actions: [],
      });
    }

    const turn = turnsMap.get(turnName)!;

    if (fileName.startsWith("screenshot_") && fileName.endsWith(".png")) {
      turn.screenshot = URL.createObjectURL(file);
    } else if (fileName.endsWith("_agent_response.json")) {
      const jsonText = await file.text();
      const agentData = parseAgentResponse(jsonText);
      if (agentData.thought) {
        turn.thought = agentData.thought;
      }
      turn.actions = agentData.actions;
    }
  }

  // Convert to sorted array
  const turns = Array.from(turnsMap.values())
    .filter((turn): turn is Turn => turn.id !== undefined)
    .sort((a, b) => a.index - b.index);

  return turns;
}

function parseAgentResponse(jsonText: string): { thought: string | null; actions: Action[] } {
  const result = {
    thought: null as string | null,
    actions: [] as Action[],
  };

  try {
    const jsonData = JSON.parse(jsonText);
    const responseData = jsonData.response || {};
    const textParts: string[] = [];

    // Extract content
    if (responseData.content) {
      textParts.push(responseData.content);
    }

    // Process output items
    const outputItems = responseData.output || [];
    for (const item of outputItems) {
      if (item.type === "message") {
        const contentItems = item.content || [];
        for (const contentItem of contentItems) {
          if (contentItem.text) {
            textParts.push(contentItem.text);
          }
        }
      } else if (item.type === "reasoning") {
        const summaryItems = item.summary || [];
        if (summaryItems.length > 0) {
          for (const summaryItem of summaryItems) {
            if (summaryItem.type === "summary_text") {
              textParts.push(summaryItem.text);
            }
          }
        } else {
          const reasoningText = item.text || "";
          if (reasoningText) {
            textParts.push(reasoningText);
          }
        }
      } else if (item.type === "computer_call") {
        const action = item.action || {};
        if (Object.keys(action).length > 0) {
          const convertedAction = convertAction(action);
          if (convertedAction) {
            result.actions.push(convertedAction);
          }
        }
      }
    }

    if (textParts.length > 0) {
      result.thought = textParts.join(" ");
    }
  } catch (error) {
    console.error("Error parsing agent response:", error);
  }

  return result;
}

function convertAction(action: any): Action | null {
  const actionType = action.type || "";

  if (actionType === "click" && action.x !== undefined && action.y !== undefined) {
    return {
      type: "click",
      position: [action.x, action.y] as Position,
      timestamp: action.timestamp,
    };
  }

  if (
    actionType === "drag" &&
    action.start_x !== undefined &&
    action.start_y !== undefined &&
    action.end_x !== undefined &&
    action.end_y !== undefined
  ) {
    return {
      type: "drag",
      from: [action.start_x, action.start_y] as Position,
      to: [action.end_x, action.end_y] as Position,
      timestamp: action.timestamp,
    };
  }

  if ((actionType === "type" || actionType === "input") && action.text) {
    return {
      type: "type",
      text: action.text,
      timestamp: action.timestamp,
    };
  }

  if (actionType === "scroll") {
    return {
      type: "scroll",
      direction: action.direction || "down",
      amount: action.amount,
      timestamp: action.timestamp,
    };
  }

  if (actionType === "key" && action.key) {
    return {
      type: "key",
      key: action.key,
      modifiers: action.modifiers,
      timestamp: action.timestamp,
    };
  }

  return null;
}
