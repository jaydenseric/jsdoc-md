/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`lib/membersToMdAst.test.js TAP membersToMdAst > Markdown AST. 1`] = `
{
  "type": "root",
  "children": [
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Table of contents"
        }
      ],
      "data": {
        "hProperties": {
          "id": "table-of-contents"
        },
        "id": "table-of-contents"
      }
    },
    {
      "type": "list",
      "ordered": false,
      "children": [
        {
          "type": "listItem",
          "loose": false,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "#type-a",
                  "children": [
                    {
                      "type": "text",
                      "value": "type A"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "loose": false,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "#type-b",
                  "children": [
                    {
                      "type": "text",
                      "value": "type B"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "loose": false,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "#constant-c",
                  "children": [
                    {
                      "type": "text",
                      "value": "constant C"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "loose": false,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "#function-d",
                  "children": [
                    {
                      "type": "text",
                      "value": "function d"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "loose": false,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "#class-e",
                  "children": [
                    {
                      "type": "text",
                      "value": "class E"
                    }
                  ]
                }
              ]
            },
            {
              "type": "list",
              "ordered": false,
              "children": [
                {
                  "type": "listItem",
                  "loose": false,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "link",
                          "title": null,
                          "url": "#e-static-method-a",
                          "children": [
                            {
                              "type": "text",
                              "value": "E static method a"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "loose": false,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "link",
                          "title": null,
                          "url": "#e-instance-method-b",
                          "children": [
                            {
                              "type": "text",
                              "value": "E instance method b"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "loose": false,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "link",
                          "title": null,
                          "url": "#e-inner-function-c",
                          "children": [
                            {
                              "type": "text",
                              "value": "E inner function c"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "loose": false,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "link",
                          "title": null,
                          "url": "#e-static-property-e",
                          "children": [
                            {
                              "type": "text",
                              "value": "E static property e"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "type A"
        }
      ],
      "data": {
        "hProperties": {
          "id": "type-a"
        },
        "id": "type-a"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "strong",
          "children": [
            {
              "type": "text",
              "value": "Type:"
            }
          ]
        },
        {
          "type": "text",
          "value": " "
        },
        {
          "type": "link",
          "url": "https://developer.mozilla.org/javascript/reference/global_objects/Object",
          "children": [
            {
              "type": "text",
              "value": "Object"
            }
          ]
        }
      ]
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Property"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/boolean",
                  "children": [
                    {
                      "type": "text",
                      "value": "boolean"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "type B"
        }
      ],
      "data": {
        "hProperties": {
          "id": "type-b"
        },
        "id": "type-b"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "strong",
          "children": [
            {
              "type": "text",
              "value": "Type:"
            }
          ]
        },
        {
          "type": "text",
          "value": " "
        },
        {
          "type": "text",
          "value": "function"
        }
      ]
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/boolean",
                  "children": [
                    {
                      "type": "text",
                      "value": "boolean"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "constant C"
        }
      ],
      "data": {
        "hProperties": {
          "id": "constant-c"
        },
        "id": "constant-c"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "function d"
        }
      ],
      "data": {
        "hProperties": {
          "id": "function-d"
        },
        "id": "function-d"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/string",
                  "children": [
                    {
                      "type": "text",
                      "value": "string"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "class E"
        }
      ],
      "data": {
        "hProperties": {
          "id": "class-e"
        },
        "id": "class-e"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/string",
                  "children": [
                    {
                      "type": "text",
                      "value": "string"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "text",
          "value": "E static method a"
        }
      ],
      "data": {
        "hProperties": {
          "id": "e-static-method-a"
        },
        "id": "e-static-method-a"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "#type-a",
                  "children": [
                    {
                      "type": "text",
                      "value": "A"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "b"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/string",
                  "children": [
                    {
                      "type": "text",
                      "value": "string"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "text",
          "value": "E instance method b"
        }
      ],
      "data": {
        "hProperties": {
          "id": "e-instance-method-b"
        },
        "id": "e-instance-method-b"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "#type-a",
                  "children": [
                    {
                      "type": "text",
                      "value": "A"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "text",
          "value": "E inner function c"
        }
      ],
      "data": {
        "hProperties": {
          "id": "e-inner-function-c"
        },
        "id": "e-inner-function-c"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    },
    {
      "type": "table",
      "children": [
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Parameter"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Type"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "Description"
                }
              ]
            }
          ]
        },
        {
          "type": "tableRow",
          "children": [
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "text",
                  "value": "a"
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "link",
                  "url": "https://developer.mozilla.org/javascript/reference/global_objects/string",
                  "children": [
                    {
                      "type": "text",
                      "value": "string"
                    }
                  ]
                }
              ]
            },
            {
              "type": "tableCell",
              "children": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Description.",
                      "position": {
                        "start": {
                          "line": 1,
                          "column": 1,
                          "offset": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 13,
                          "offset": 12
                        },
                        "indent": []
                      }
                    }
                  ],
                  "position": {
                    "start": {
                      "line": 1,
                      "column": 1,
                      "offset": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 13,
                      "offset": 12
                    },
                    "indent": []
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "text",
          "value": "E static property e"
        }
      ],
      "data": {
        "hProperties": {
          "id": "e-static-property-e"
        },
        "id": "e-static-property-e"
      }
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Description.",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 13,
              "offset": 12
            },
            "indent": []
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        },
        "indent": []
      }
    }
  ]
}
`

exports[`lib/membersToMdAst.test.js TAP membersToMdAst > Markdown. 1`] = `
### Table of contents

- [type A](#type-a)
- [type B](#type-b)
- [constant C](#constant-c)
- [function d](#function-d)
- [class E](#class-e)
  - [E static method a](#e-static-method-a)
  - [E instance method b](#e-instance-method-b)
  - [E inner function c](#e-inner-function-c)
  - [E static property e](#e-static-property-e)

### type A

Description.

**Type:** [Object](https://developer.mozilla.org/javascript/reference/global_objects/Object)

| Property | Type                                                                                 | Description  |
| -------- | ------------------------------------------------------------------------------------ | ------------ |
| a        | [boolean](https://developer.mozilla.org/javascript/reference/global_objects/boolean) | Description. |

### type B

Description.

**Type:** function

| Parameter | Type                                                                                 | Description  |
| --------- | ------------------------------------------------------------------------------------ | ------------ |
| a         | [boolean](https://developer.mozilla.org/javascript/reference/global_objects/boolean) | Description. |

### constant C

Description.

### function d

Description.

| Parameter | Type                                                                               | Description  |
| --------- | ---------------------------------------------------------------------------------- | ------------ |
| a         | [string](https://developer.mozilla.org/javascript/reference/global_objects/string) | Description. |

### class E

Description.

| Parameter | Type                                                                               | Description  |
| --------- | ---------------------------------------------------------------------------------- | ------------ |
| a         | [string](https://developer.mozilla.org/javascript/reference/global_objects/string) | Description. |

#### E static method a

Description.

| Parameter | Type                                                                               | Description  |
| --------- | ---------------------------------------------------------------------------------- | ------------ |
| a         | [A](#type-a)                                                                       | Description. |
| b         | [string](https://developer.mozilla.org/javascript/reference/global_objects/string) | Description. |

#### E instance method b

Description.

| Parameter | Type         | Description  |
| --------- | ------------ | ------------ |
| a         | [A](#type-a) | Description. |

#### E inner function c

Description.

| Parameter | Type                                                                               | Description  |
| --------- | ---------------------------------------------------------------------------------- | ------------ |
| a         | [string](https://developer.mozilla.org/javascript/reference/global_objects/string) | Description. |

#### E static property e

Description.

`
