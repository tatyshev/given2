declare const given2: {
  <T = any>(key: string, callback: () => T): T
  [key: string]: any
};

export = given2;
export as namespace given2;
