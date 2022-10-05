import { GetServerSideProps, NextPage } from 'next';
import getProjects from '../utils/api/projects';

interface Props {
  projects: Array<Project>;
}

const Project: NextPage<Props> = ({ projects }) => {
  return (
    <>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.desc}</p>
          <p>{new Date(project.createdAt).toUTCString()}</p>
        </div>
      ))}
    </>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const projects = await getProjects();
  return {
    props: { projects },
  };
};
