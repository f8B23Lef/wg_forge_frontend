const isElementExist = element => !!document.querySelector(`${element}`);

const removeChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export { isElementExist, removeChildren };
