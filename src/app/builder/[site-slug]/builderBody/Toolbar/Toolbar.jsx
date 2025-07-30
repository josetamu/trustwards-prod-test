import { useCanvas } from "@contexts/CanvasContext";

export const Toolbar = () => {
    const { addElement } = useCanvas();

    const createBlock = () => {
        addElement({
            tagName: "div",
            children: []
        });
    };

    const createText = () => {
        addElement({
            tagName: "h1",
            text: "New Text"
        });
    };

    return (
        <div className="tw-builder__toolbar">
            <button onClick={createBlock}>Create Block</button>
            <button onClick={createText}>Create Text</button>
        </div>
    );
};