class CustomEmojiBlock {
  constructor({ data }) {
    console.log(data);
    this.data = data;
  }
  render() {
    const img = document.createElement("img");
    img.setAttribute("src", this.data.imageUrl);
    return img;
  }
  save(blockContent) {
    return {
      imageUrl: blockContent.getAttribute("src"),
    };
  }
}

export default CustomEmojiBlock;
