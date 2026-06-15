import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
}

export default function Course({ data }: CourseProps) {
  const inner = (
    <>
      <h4 className="course-number">{data.number}:</h4>
      <p className="course-name">{data.title}</p>
    </>
  );

  return (
    <li className="course-container">
      {data.link ? <a href={data.link}>{inner}</a> : <div>{inner}</div>}
    </li>
  );
}
