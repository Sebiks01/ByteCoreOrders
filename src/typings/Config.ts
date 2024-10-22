export type ConfigType = {
  coreGuildId: string[];
  testGuildId: string[];
  successfullOrdersLogChannelId: string[];
  givenLicensesLogChannelId: string[];
  debug: boolean;

  products: {
    roleId: string;
    paymentMethods: string[];
    currency: string;
    productName: string;
    price: number;
    quantity: number;
    success_url: string;
    cancel_url: string;
    license: {
      productId: number;
      description: string;
      addressLimit: number;
      addressDuration: number;
      addons: number[];
    };
  }[];
};
