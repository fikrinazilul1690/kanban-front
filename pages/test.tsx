import { NextPage } from 'next';
import Layout from '../components/layout/layout';

interface Props {}

const Test: NextPage<Props> = ({}) => {
  return (
    <Layout>
      <h2>Hello world</h2>
    </Layout>
  );
};

export default Test;
