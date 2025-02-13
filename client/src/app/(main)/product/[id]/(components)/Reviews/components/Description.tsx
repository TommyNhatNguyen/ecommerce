import { YOUTUBE_EMBEDLINK } from "@/app/constants/youtube-path";
import { RichTextContainer } from "@/app/shared/components/Container";
import React, { useEffect, useRef } from "react";

type Props = {
  description: string;
  name: string;
};

const Description = ({ description, name }: Props) => {
  const richTextContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (richTextContainerRef.current && description) {
      richTextContainerRef.current
        .querySelectorAll("oembed")
        .forEach((oembed) => {
          const urlKey = oembed.getAttribute("url")?.split("=")[1];
          const newUrl = `${YOUTUBE_EMBEDLINK}/${urlKey}`;
          if (newUrl) {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("src", newUrl);
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "100%");
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            oembed.replaceWith(iframe);
          }
        });
    }
  }, [description]);

  return (
    <div className="content__description h-full overflow-y-auto px-4 text-white">
      <h3 className="font-roboto-bold text-h3">Product Info: {name}</h3>
      <RichTextContainer
        classes="text-p1 mt-[16px] max-h-[50lvh] "
        dangerouslySetInnerHTML={{ __html: description as string }}
        ref={richTextContainerRef}
      ></RichTextContainer>
    </div>
  );
};

export default Description;
