import { IoClose } from 'react-icons/io5';
import { FaRegBookmark } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { MdComment } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import { MdFileUpload } from 'react-icons/md';
import { TfiWrite } from 'react-icons/tfi';
import { RiArrowDropDownLine } from 'react-icons/ri';

const icons = {
  close: <IoClose />,
  bookmark: <FaRegBookmark className=" text-xl" />,
  bookmarked: <FaBookmark className=" text-xl" />,
  plus: <FiPlus className="" />,
  comment: <MdComment />,
  closedComment: <MdOutlineInsertComment />,
  upload: <MdFileUpload />,
  write: <TfiWrite />,
  arrow: <RiArrowDropDownLine />,
};

export default icons;
