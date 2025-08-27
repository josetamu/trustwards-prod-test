import { useState } from "react";

export default function BuilderClasses({selectedId}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="tw-builder__settings-classes">
            <span className="tw-builder__settings-id" onClick={() => {
                setIsOpen(!isOpen);
            }}>#{selectedId}</span>
            {isOpen && (
                <div className="tw-builder__settings-classes-selected">
                   hola
                </div>
            )}
        </div>
    )
}