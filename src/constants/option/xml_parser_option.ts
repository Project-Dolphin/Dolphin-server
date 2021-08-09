var he = require('he')

export const options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr",
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false,
    attrValueProcessor: function (val: any, attrName: any) { return he.decode(val, { isAttributeValue: true }); },
    tagValueProcessor: function (val: any, tagName: any) { return he.decode(val); },
    stopNodes: ["parse-me-as-string"]
};