const channelId = "my-site-u8spgfpjqv8"; // Replace with the ID of the ARE.NA channel

const fetchArenaChannel = async (id) => {
  console.log("Fetching ARE.NA channel");
  const main = document.getElementById("main");
  console.log(main);
  fetch(`https://api.are.na/v2/channels/${id}/contents`)
    .then((response) => response.json())
    .then((data) => {
      // Loop through the blocks in the channel
      const htmlBlocks = data.contents.map(renderBlock);
      // Append the blocks to the DOM
      htmlBlocks.forEach((block) => main.appendChild(block));
    });
};

const renderBlock = (block) => {
  switch (block.class) {
    case "Image":
      return renderImageBlock(block);
    case "Link":
      return renderLinkBlock(block);
    case "Text":
      return renderTextBlock(block);

    // TODO: Add more block types
    case "Media":
    case "Attachment":
      return null;
  }
};

const renderFolder = ({ title, description, image, href }) => {
  const containerElement = document.createElement("div");
  containerElement.classList.add("folder");
  const detailsElement = document.createElement("details");
  const summaryElement = document.createElement("summary");
  summaryElement.innerHTML = `<b>${title}</b>`;

  const informationElement = document.createElement("p");
  informationElement.innerHTML = `${description}`;

  // If we should link out, wrap folder contents in link tag
  if (href) {
    const linkElement = document.createElement("a");
    linkElement.href = href;
    linkElement.target = "_blank";
    if (image) {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      linkElement.appendChild(imageElement);
    }

    linkElement.appendChild(informationElement);
    detailsElement.appendChild(summaryElement);
    detailsElement.appendChild(linkElement);
  } else {
    if (image) {
      const imageElement = document.createElement("img");
      imageElement.src = image;
      detailsElement.appendChild(imageElement);
    }

    detailsElement.appendChild(informationElement);
    detailsElement.appendChild(summaryElement);
  }

  containerElement.appendChild(detailsElement);
  return containerElement;
};

const renderImageBlock = (block) => {
  const { title, description, image } = block;
  return renderFolder({ title, description, image: image.display.url });
};

const renderLinkBlock = (block) => {
  const { title, description, image } = block;
  return renderFolder({
    title,
    description,
    image: image.display.url,
    href: block.source.url,
  });
};

const renderTextBlock = (block) => {
  const { title, content_html } = block;
  return renderFolder({ title, description: content_html });
};

window.addEventListener(
  "DOMContentLoaded",
  () => fetchArenaChannel(channelId),
  false
);
