import Repo from '@/app/components/Repo';
import Link from 'next/link';

const RepoPage = ({ params: { name } }) => {
  return (
    <div className='card'>
      <Link href='/code/repos' className='btn btn-back'>
        Back to repository list
      </Link>
      <Repo name={name} />
    </div>
  );
};

export default RepoPage;
