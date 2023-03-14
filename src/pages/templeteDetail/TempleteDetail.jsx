import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  arrowBack,
  arrowDown,
  arrowDownTwo,
  dummyOne,
  dummyThree,
  dummyTwo,
  dummyWithBg,
  edit,
} from "../../assets";
import {
  ChooseBackgroundModel,
  CompositionModel,
  CustomInputWithDropdown,
  DropdownModel,
  Footer,
  GenderModel,
  NavBar,
  TempleteView,
} from "../../components";
import "./templeteDetail.css";

export default function TempleteDetail() {
  const navigate = useNavigate();
  const [showFrameModel, setShowFrameModel] = useState(false);
  const [showDimensionModel, setShowDimensionModel] = useState(false);
  const [showEditNameDropdown, setShowEditNameDropdown] = useState(false);
  const [showEditBackgroundDropdown, setShowEditBackgroundDropdown] =
    useState(false);
  const [showEditAdultOneDropdown, setShowEditAdultOneDropdown] =
    useState(false);
  const [showEditAdultTwoDropdown, setShowEditAdultTwoDropdown] =
    useState(false);
  const [showEditChildOneDropdown, setShowEditChildOneTwoDropdown] =
    useState(false);
  const [showEditChildTwoDropdown, setShowEditChildTwoDropdown] =
    useState(false);
  const [familyCompositionModel, setFamilyCompositionModel] = useState(false);
  const [chooseBackgroundModel, setChooseBackgroundModel] = useState(false);
  const [chooseGenderModel, setChooseGenderModel] = useState(false);

  const [selectedFrame, setSelectedFrame] = useState({
    id: 1,
    name: "Without Frame",
  });
  const [selectedDimension, setSelectedDimesion] = useState({
    id: 1,
    name: "A3 - (29,7 x 42 cm",
  });

  const sideTempleArray = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
  ];
  const frameArray = [
    {
      id: 1,
      name: "Without Frame",
    },
    {
      id: 2,
      name: "With Frame",
    },
  ];
  const dimensionArray = [
    {
      id: 1,
      name: "A3 - (29,7 x 42 cm)",
    },
    {
      id: 2,
      name: "A4 - (29,7 x 42 cm)",
    },
    {
      id: 2,
      name: "A6 - (29,7 x 42 cm)",
    },
  ];
  const templeteArray = [
    {
      id: 1,
      image: dummyOne,
      price: "$35",
    },
    {
      id: 2,
      image: dummyTwo,
      price: "$35",
    },
    {
      id: 3,
      image: dummyThree,
      price: "$35",
    },
    {
      id: 4,
      image: dummyOne,
      price: "$35",
    },
    {
      id: 5,
      image: dummyThree,
      price: "$35",
    },
    {
      id: 6,
      image: dummyOne,
      price: "$35",
    },
    {
      id: 7,
      image: dummyThree,
      price: "$35",
    },
    {
      id: 8,
      image: dummyTwo,
      price: "$35",
    },
  ];

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      {familyCompositionModel && (
        <CompositionModel onClick={() => setFamilyCompositionModel(false)} />
      )}
      {chooseBackgroundModel && (
        <ChooseBackgroundModel
          onClick={() => setChooseBackgroundModel(false)}
        />
      )}
      {chooseGenderModel && (
        <GenderModel onClick={() => setChooseGenderModel(false)} />
      )}

      <div className="cactus-dashboard-container">
        <div className="cactus-templet_detail_top_container">
          <div className="cactus-templete_detail_side_templetes_view">
            <img
              src={arrowBack}
              className="cactus-templete_detail_side__view_arrow_up"
            />
            {sideTempleArray.map((item) => {
              return (
                <img
                  key={item.id}
                  src={dummyWithBg}
                  className="cactus-templete_detail_side__view_image_style"
                />
              );
            })}
            <img
              src={arrowBack}
              className="cactus-templete_detail_side__view_arrow_down"
            />
          </div>
          <div className="cactus-templete_detail-main_image_view">
            <div className="cactus-templete_detail-main_image_button_view">
              <h5>Family Outing</h5>
            </div>
            <div className="cactus-templete_detail-main_image">
              <img src={dummyWithBg} />
            </div>
          </div>
          <div className="cactus-templete_detail-detail_top_view">
            <h1>Personalized family outing</h1>
            <h2>Free Delivery</h2>
            <h3>$35</h3>
            <DropdownModel
              name={selectedFrame.name}
              array={frameArray}
              dropdownValue={false}
              onClickValue={(data) => [
                setSelectedFrame(data),
                setShowFrameModel(false),
              ]}
              onClick={() => setShowFrameModel(!showFrameModel)}
            />
            <DropdownModel
              name={selectedDimension.name}
              array={dimensionArray}
              dropdownValue={showDimensionModel}
              onClickValue={(data) => [
                setSelectedDimesion(data),
                setShowDimensionModel(false),
              ]}
              onClick={() => setShowDimensionModel(!showDimensionModel)}
            />
            <div className="cactus-templete_detail-form_top_view">
              <div className="cactus-templete_detail-form_title">
                <h4>Personalize</h4>
                <h5>COMPOSITION OF THE FAMILY</h5>
              </div>
              <CustomInputWithDropdown
                type={"name"}
                value={"Edit Name"}
                dropdownValue={showEditNameDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditNameDropdown(!showEditNameDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseBackgroundModel(true)}
                type={"background"}
                value={"Edit Background"}
                dropdownValue={showEditBackgroundDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditBackgroundDropdown(!showEditBackgroundDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseGenderModel(true)}
                type={"adult"}
                value={"Edit Adult 1"}
                dropdownValue={showEditAdultOneDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditAdultOneDropdown(!showEditAdultOneDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseGenderModel(true)}
                type={"adult"}
                value={"Edit Adult 2"}
                dropdownValue={showEditAdultTwoDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditAdultTwoDropdown(!showEditAdultTwoDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseGenderModel(true)}
                type={"child"}
                value={"Edit Child 1"}
                dropdownValue={showEditChildOneDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditChildOneTwoDropdown(!showEditChildOneDropdown)
                }
              />
              <CustomInputWithDropdown
                onClickButton={() => setChooseGenderModel(true)}
                type={"child"}
                value={"Edit Child 2"}
                dropdownValue={showEditChildTwoDropdown}
                onClickEditNameDropdown={() =>
                  setShowEditChildTwoDropdown(!showEditChildTwoDropdown)
                }
              />
            </div>
            <div
              onClick={() => navigate("/billingAddress")}
              className="cactus-templete_detail-order_button"
            >
              <h5>Order Now</h5>
            </div>
          </div>
        </div>
        <div className="cactus-templet_detail_bottom_view">
          <h1>Recently Viewed</h1>
          <div className="cactus-dashboard-templete_top_view">
            {templeteArray.map((item) => {
              return (
                <TempleteView
                  onClick={() => navigate("/templetedetail")}
                  item={item}
                />
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
