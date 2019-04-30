function getPageOffsets(element) {
  return element.getBoundingClientRect();
}

function getPositionedLeft(element) {
  return parseInt(element.style.left, 10);
}

function getPositionedTop(element) {
  return parseInt(element.style.top, 10);
}

function getPosition(element) {
  return {
    left: getPositionedLeft(element),
    top: getPositionedTop(element),
  };
}

function setElementLeft(element, left) {
  element.style.left = `${left}px`;
}

function setElementTop(element, top) {
  element.style.top = `${top}px`;
}

function shiftElement(element, shift) {
  const lastElementLeft = getPositionedLeft(element);
  const lastElementTop = getPositionedTop(element);

  const newElementLeft = lastElementLeft + shift.x;
  setElementLeft(element, newElementLeft);

  const newElementTop = lastElementTop + shift.y;
  setElementTop(element, newElementTop);
}

export {
  getPageOffsets,
  getPositionedLeft,
  getPositionedTop,
  getPosition,
  setElementLeft,
  setElementTop,
  shiftElement,
};
