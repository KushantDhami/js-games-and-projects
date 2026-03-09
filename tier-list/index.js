document.addEventListener("DOMContentLoaded", () => {
  const allImages = document.getElementById("all-images");
  const resetButton = document.querySelector(".reset-btn");
  const sectionContainers = Array.from(
    document.querySelectorAll(".section-images"),
  );

  const images = [
    "CaptainAmerica.jpg",
    "Thor.jpg",
    "IronMan.jpg",
    "Hulk.jpg",
    "CaptainMarvel.jpg",
    "Loki.jpg",
    "Natasha.jpg",
    "Wanda.jpg",
    "SpiderMan.jpg",
    "Vision.jpg",
  ];

  const imageElements = [];

  function createImages() {
    images.forEach((src, index) => {
      const element = document.createElement("img");
      element.classList.add("img");
      element.id = `img-${index}`;
      element.src = `./images/${src}`;
      element.draggable = true;
      element.addEventListener("dragstart", onDragStart);

      imageElements.push(element);
    });
  }

  function onDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.effectAllowed = "move";
  }

  function getDropZone(target) {
    return (
      target.closest(".section-images") ||
      (target.id === "all-images" ? target : null)
    );
  }

  function onDragOver(e) {
    e.preventDefault();
    const dropZone = getDropZone(e.target);
    if (dropZone) {
      dropZone.classList.add("drop-target");
    }
  }

  function onDragLeave(e) {
    const dropZone = getDropZone(e.target);
    if (dropZone) {
      dropZone.classList.remove("drop-target");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const dragged = document.getElementById(id);
    const dropZone = getDropZone(e.target);

    sectionContainers.forEach((c) => c.classList.remove("drop-target"));
    if (allImages) allImages.classList.remove("drop-target");

    if (!dropZone || !dragged) return;

    if (e.target.classList.contains("img")) {
      dropZone.insertBefore(dragged, e.target.nextSibling);
    } else {
      dropZone.appendChild(dragged);
    }
  }

  function addDragListeners(container) {
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("dragleave", onDragLeave);
    container.addEventListener("drop", onDrop);
  }

  function reset() {
    sectionContainers.forEach((container) => {
      container.classList.remove("drop-target");
    });

    const shuffled = [...imageElements].sort(() => Math.random() - 0.5);

    allImages.innerHTML = "";

    shuffled.forEach((img) => {
      allImages.appendChild(img);
    });
  }

  function init() {
    createImages();

    sectionContainers.forEach(addDragListeners);
    addDragListeners(allImages);

    resetButton.addEventListener("click", reset);
    reset();
  }

  init();
});
