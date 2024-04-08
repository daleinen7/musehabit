import { IoClose } from 'react-icons/io5';
import { FaRegBookmark } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { MdComment } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import { MdFileUpload } from 'react-icons/md';
import { TfiWrite } from 'react-icons/tfi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { MdOutlineArrowForward } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { IoIosPin } from 'react-icons/io';
import { MdOutlineDesignServices } from 'react-icons/md';
import { IoMdLink } from 'react-icons/io';
import { SiCountingworkspro } from 'react-icons/si';

const icons = {
  close: <IoClose />,
  bookmark: <FaRegBookmark className=" text-xl" />,
  bookmarked: <FaBookmark className=" text-xl" />,
  link: <IoMdLink />,
  plus: <FiPlus className="" />,
  comment: <MdComment />,
  google: <AiFillGoogleCircle />,
  closedComment: <MdOutlineInsertComment />,
  upload: <MdFileUpload />,
  write: <TfiWrite />,
  design: <MdOutlineDesignServices />,
  arrow: <RiArrowDropDownLine />,
  arrowRight: <MdOutlineArrowForward />,
  dots: <PiDotsThreeOutlineVerticalFill className=" text-xl" />,
  settings: <IoSettingsSharp />,
  edit: <MdEdit />,
  pin: <IoIosPin />,
  user: <FaUser />,
  countingworkspro: <SiCountingworkspro />,
};

export default icons;
