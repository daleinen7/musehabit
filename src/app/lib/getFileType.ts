const getFileType = (format: string) => {
  // Map file extensions to types
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mkv', 'mov'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];

  if (imageExtensions.includes(format)) {
    return 'image';
  } else if (videoExtensions.includes(format)) {
    return 'video';
  } else if (audioExtensions.includes(format)) {
    return 'audio';
  } else {
    return 'writing';
  }
};

export default getFileType;
