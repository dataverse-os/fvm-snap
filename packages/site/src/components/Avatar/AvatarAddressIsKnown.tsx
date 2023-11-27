import React, { memo, useEffect, useState } from "react";

import { Avatar as AvatarSrc } from "@dataverse/dataverse-components";

import { normalizedAddress } from "@/utils";

interface AvatarAddressIsKnownProps {
  address: string;
  className?: string;
}

export interface Original {
  src: string;
  mimeType: string;
  width: number;
  height: number;
}

const ipfsNull = "ipfs://null";
const defaultOriginal: Original = {
  src: ipfsNull,
  mimeType: "",
  width: 1,
  height: 1,
};
const contextAvatar = (address?: string) =>
  address
    ? `https://mint.fun/api/avatar/${normalizedAddress(address)}?size=150`
    : "";

const emptyProfile = {
  name: "",
  description: "",
  image: {
    original: defaultOriginal,
  },
  background: {
    original: defaultOriginal,
  },
};

const AvatarAddressIsKnown = function ({
  address,
  className,
}: AvatarAddressIsKnownProps) {
  const [avatar, setAvatar] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);

  async function load() {
    if (imageLoading) return;
    setImageLoading(true);
    emptyProfile.image.original.src = contextAvatar(address);
    setImageLoading(false);
    setAvatar(contextAvatar(address));
  }

  useEffect(() => {
    load();
  }, [address]);

  return (
    <AvatarSrc
      className={className}
      avatar={avatar}
      imageLoading={imageLoading}
    />
  );
};

export default memo(AvatarAddressIsKnown);
