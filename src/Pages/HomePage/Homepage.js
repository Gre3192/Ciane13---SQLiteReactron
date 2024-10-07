import '../../Css/BubbleAnimation.css';
import Ciane13Logo from '../../Assets/Ciane13Manager_nobg.svg'; // Import del logo

const HomePage = () => {
  return (
    <>
      <div className="select-none flex items-center justify-center h-screen">
        <div className="box flex flex-col items-center justify-center p-20">
          <img src={Ciane13Logo} alt="Ciane13 Logo" className=" h-auto mb-4" />
        </div>
      </div>
    </>
  );
}

export default HomePage;
