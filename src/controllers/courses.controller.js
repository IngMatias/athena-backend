import { getCourses, getCoursesByUser } from "../db/course.db.js";
import { getImagesUrls } from "../s3/imges.s3.js";

export const getCoursesController = async (req, res) => {
  const { contains } = req.query;

  let data = await getCourses({ contains });

  const imagesUrls = await getImagesUrls(data.map(({ id }) => id));

  for (const d of data) {
    d.courseDetails[0].imageUrl = imagesUrls[d.id];
  }

  res.json({ data });
};

export const getCoursesByUserController = async (req, res) => {
  const { id: userId, languageId } = req.user;

  let data = await getCoursesByUser({ userId });

  const imagesUrls = await getImagesUrls(data.map(({ id }) => id));

  for (const d of data) {
    d.imageUrl = imagesUrls[d.id];
  }
  console.log(data);

  res.json({ data });
};
