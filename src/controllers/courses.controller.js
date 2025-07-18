import { getCourses, getCoursesByUser } from "../db/course.db.js";

export const getCoursesController = async (req, res) => {
  const { contains } = req.query;

  let data = await getCourses({ contains });
  
  res.json({ data });
};

export const getCoursesByUserController = async (req, res) => {
  const { id: userId, languageId } = req.user;

  let data = await getCoursesByUser({ userId });

  res.json({ data });
};
