// Checking the Image
// Notice that we have to take into account if a user tries
// to drag and drop multiple file of any type at one time!

const fileSize = (element) => {
  document.cookie = `fileSize=${element.files[0].size}`;
};

// We want to accept image files from the file uploader
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const validateFile = (file) => {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/x-icon",
  ];
  //if the type is not found in the array, it returns -1
  if (validTypes.indexOf(file.type) === -1) {
    return false;
  }
};

const handleFiles = (files) => {
  if (validateFile(files[i])) {
    // add to an array so we can display the name of the file
  } else {
    // add a new property called invalid
    // add to the same array so we can display the name of the file
    // set error message
  }
  console.log("Thank You!");
};

// Using the event from the droppable element we want to parses the files
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
const fileDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length) {
    handleFiles(files);
  }
};
