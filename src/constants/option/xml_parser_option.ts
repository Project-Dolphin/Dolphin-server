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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  attrValueProcessor: (val: any): string => {
    return he.decode(val, { isAttributeValue: true });
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  tagValueProcessor: (val: any): string => {
    return he.decode(val);
  },
  stopNodes: ['parse-me-as-string'],
};
