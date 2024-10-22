import { ButtonStyle } from "discord.js";

export type LangConfigType = {
  dashboard: {
    productsDashboard: {
      content?: string;
      embeds?: EmbedType[];
      button: ButtonComponentType;
    }[];

    dmPaymentMessage: {
      content?: string;
      embeds?: EmbedType[];
    };

    messages: {
      invalidChannel: {
        content?: string;
        embeds?: EmbedType[];
      };

      dashboardSent: {
        content?: string;
        embeds?: EmbedType[];
      };

      error: {
        content?: string;
        embeds?: EmbedType[];
      };

      fetchingPayment: {
        content?: string;
        embeds?: EmbedType[];
      };

      paymentLink: {
        "//": string;
        content?: string;
        embeds?: EmbedType[];
      };

      paymentError: {
        content?: string;
        embeds?: EmbedType[];
      };

      alreadyPurchased: {
        content?: string;
        embeds?: EmbedType[];
      };
    };
  };

  logs: {
    successfullOrders: {
      "//": string;
      content?: string;
      embeds?: EmbedType[];
    };

    givenLicenses: {
      "//": string;
      content?: string;
      embeds?: EmbedType[];
    };
  };

  misc: {
    reloading: {
      content?: string;
      embeds?: EmbedType[];
    };

    reloaded: {
      content?: string;
      embeds?: EmbedType[];
    };

    error: {
      content?: string;
      embeds?: EmbedType[];
    };

    uknownCommand: {
      content?: string;
      embeds?: EmbedType[];
    };
  };
};

type EmbedType = {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooterType;
  image?: EmbedImageType;
  thumbnail?: EmbedThumbnailType;
  author?: EmbedAuthorType;
  fields?: EmbedFieldType[];
};

type EmbedFooterType = {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

type EmbedImageType = {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
};

type EmbedThumbnailType = {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
};

type EmbedAuthorType = {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

type EmbedFieldType = {
  name: string;
  value: string;
  inline?: boolean;
};

type ButtonComponentType = {
  label?: string;
  emoji?: string;
  style: ButtonStyle;
};
