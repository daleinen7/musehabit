import { IoClose } from 'react-icons/io5';
import { FaRegBookmark } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { MdComment } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import { BsFillCloudUploadFill } from 'react-icons/bs';
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
import { IoMdTrash } from 'react-icons/io';
import { IoMdLink } from 'react-icons/io';
import { SiCountingworkspro } from 'react-icons/si';
import { MdOpenInFull } from 'react-icons/md';

const icons = {
  close: <IoClose />,
  bookmark: <FaRegBookmark className=" text-2xl" />,
  bookmarked: <FaBookmark className=" text-2xl" />,
  link: <IoMdLink />,
  plus: <FiPlus className="" />,
  comment: <MdComment />,
  google: <AiFillGoogleCircle />,
  closedComment: <MdOutlineInsertComment />,
  upload: <BsFillCloudUploadFill />,
  write: <TfiWrite />,
  design: <MdOutlineDesignServices />,
  arrow: <RiArrowDropDownLine />,
  arrowRight: <MdOutlineArrowForward />,
  dots: <PiDotsThreeOutlineVerticalFill className=" text-xl" />,
  settings: <IoSettingsSharp />,
  edit: <MdEdit />,
  trash: <IoMdTrash />,
  pin: <IoIosPin />,
  user: <FaUser />,
  countingworkspro: <SiCountingworkspro />,
  expand: <MdOpenInFull />,
};

export default icons;
