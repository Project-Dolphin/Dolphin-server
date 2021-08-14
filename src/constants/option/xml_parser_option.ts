import * as he from 'he';

export const options = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr',
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata',
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false,
  attrValueProcessor: (val: any, attrName: any): string => {
    return he.decode(val, { isAttributeValue: true });
  },
  tagValueProcessor: (val: any, tagName: any): string => {
    return he.decode(val);
  },
  stopNodes: ['parse-me-as-string'],
};
