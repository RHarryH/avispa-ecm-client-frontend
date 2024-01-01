import React, {ElementRef, useEffect, useRef} from "react";
import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';
import {useEventContext} from "./event/EventContext";

interface TreeViewProps {
    treeData: object
}

function TreeView({treeData}:TreeViewProps) {
    const ref = useRef<ElementRef<"div">>(null);

    const { publishEvent } = useEventContext();

    useEffect(() => {
        const treeReference = ref.current;

        if(treeReference) {
            $(treeReference).on("changed.jstree", function (e, data) {
                if (data.action === "select_node") {
                    publishEvent({
                        type: "REPOSITORY_ITEM_SELECTED",
                        payload: {
                            id: data.node.id,
                            focus: data.event?.type === 'click'
                        }
                    })
                } else if (data.action === "deselect_node") { // do not pass id
                    publishEvent({
                        type: "REPOSITORY_ITEM_DESELECTED"
                    })
                }
            })

            const tree = $(treeReference).jstree(true);
            if(tree) {
                const settings = tree.settings;
                if (settings) {
                    settings.core.data = treeData;
                }
                tree.refresh();
            } else {
                const options: JSTreeStaticDefaults = {
                    core: {
                        multiple: false,
                        themes: {stripes: true, dots: false, variant: "large"},
                        data: treeData,
                        error: () => {
                            console.log("ERROR")
                        }
                    },
                    types: {
                        "#": {
                            "max_children": 1,
                            //"max_depth" : 4,
                            "valid_children": ["root"]
                        },
                        "root": {
                            "icon": "bi bi-archive-fill"
                        },
                        "folder": {
                            "icon": "bi bi-folder-fill"
                        },
                        "default": { // unknown file type
                            "icon": "bi bi-file-earmark",
                            "valid_children": []
                        },
                        "pdf": {
                            "icon": "bi bi-file-earmark-pdf",
                            "valid_children": []
                        },
                        "odt": {
                            "icon": "bi bi-file-richtext",
                            "valid_children": []
                        },
                        "rtf": {
                            "icon": "bi bi-file-richtext",
                            "valid_children": []
                        },
                        "doc": {
                            "icon": "bi bi-file-earmark-word",
                            "valid_children": []
                        },
                        "docx": {
                            "icon": "bi bi-file-earmark-word",
                            "valid_children": []
                        },
                        "csv": {
                            "icon": "bi bi-file-earmark-text",
                            "valid_children": []
                        },
                        "txt": {
                            "icon": "bi bi-file-earmark-zip",
                            "valid_children": []
                        },
                        "zip": {
                            "icon": "bi bi-file-earmark-zip",
                            "valid_children": []
                        },
                        "rar": {
                            "icon": "bi bi-file-earmark-zip",
                            "valid_children": []
                        }
                    },
                    "plugins": [
                        "types", "sort"
                    ]
                };

                $(treeReference).jstree(options);
            }
        }
    }, [treeData]);

    return (<div ref={ref} className="overflow-auto"></div>);
}

export default TreeView;