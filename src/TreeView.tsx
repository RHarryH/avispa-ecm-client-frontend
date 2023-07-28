import React, {ElementRef, useEffect, useRef, useState} from "react";
import $ from 'jquery';
import 'jstree/dist/jstree.min';
import 'jstree/dist/themes/default/style.css';

interface TreeViewProps {
    treeData: object
}

function TreeView({treeData}:TreeViewProps) {
    const [selected, setSelected] = useState<string>();
    const ref = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        const treeReference = ref.current;

        if(treeReference) {
            $(treeReference).on("changed.jstree", function (e, data) {
                if(data.action === "select_node") {
                    setSelected(data.node.id)
                } else if(data.action === "deselect_node") { // do not pass id
                    setSelected(undefined)
                }
            })

            const tree = $(treeReference).jstree(true);
            if(tree) {
                const settings = tree.settings;
                if(settings) {
                    settings.core.data = treeData;
                }
                tree.refresh();
            } else {
                $(treeReference).jstree(
                    {
                        "core": {
                            "multiple": false,
                            "themes": {"stripes": true, "dots": false, "variant": "large"}
                        },
                        "types": {
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
                    }
                );
            }
        }
    }, [treeData]);

    return (<>
            <div ref={ref} className="overflow-auto"></div>
            <span>Selected: {selected}</span>
        </>
    );
}

export default TreeView;