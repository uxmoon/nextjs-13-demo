import Link from 'next/link';

// async function fetchCourses() {
//   const response = await fetch('http://localhost:3000/api/courses');
//   const courses = await response.json();
//   return courses;
// }
const Courses = ({ courses }) => {
  // const courses = fetchCourses();
  return (
    <div className='courses'>
      <h2>Courses list</h2>
      {courses.map((course) => (
        <div key={course.id} className='card'>
          <h3>{course.title}</h3>
          <small>Level: {course.level}</small>
          <p>{course.description}</p>
          <Link href={course.link} target='_blank' className='btn'>
            Go to course
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Courses;
