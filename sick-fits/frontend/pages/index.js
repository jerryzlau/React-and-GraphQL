import Items from '../components/Items';

const Home = props => {
  return (
    <Items page={parseFloat(props.query.page) || 1}/>
  );
};

Home.propTypes = {
  
};

export default Home;