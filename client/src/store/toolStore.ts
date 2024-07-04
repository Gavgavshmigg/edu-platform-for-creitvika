import { makeAutoObservable } from "mobx";
import Tool from "../components/Tasks/BoardTask/tools/Tool";

class ToolStore {
    tool: Tool | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setTool(tool: Tool) {
        this.tool = tool;
    }
}

export default new ToolStore();