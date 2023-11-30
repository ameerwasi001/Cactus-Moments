import React from "react";
import { aboutUsBorder, terms } from "../../assets";
import { Footer, NavBar } from "../../components";
import "./terms.css";

export default function Terms() {
  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      <div className="cactus-dashboard-container">
        <div
          className="cactus-about_us-banner_top_view"
          style={{ backgroundColor: "#EAF6FF" }}
        >
          <div className="cactus-about_us-banner_title_view">
            <h1>Terms & Conditions</h1>
            <img src={aboutUsBorder} />
            <h2>{"Acceuil > Term & Conditions"}</h2>
          </div>
          <div className="cactus-about_us-banner_image_view">
            <img src={terms} />
          </div>
        </div>
        <div className="cactus-privacy_detail_top_view">
          <h1>Last Update 1/30/2023</h1>
          <h2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitant
            aliquet sed in suspendisse diam. Nulla egestas elementum enim, sed
            eleifend sit sed. Pulvinar ac odio porttitor nunc faucibus massa
            vitae consectetur. Elit volutpat eu non enim tellus duis ante nisi,
            fermentum. Suspendisse commodo id lobortis est. Aliquam, odio at
            massa ut gravida facilisi non dui. Erat diam, amet nulla condimentum
            nisi et quis ut justo. Non nunc sit volutpat pretium, ut. Imperdiet
            lobortis in amet, dolor vulputate amet. Facilisis at vestibulum
            turpis platea odio consectetur et, eget.
            <br />
            Lacus vitae varius suspendisse arcu, non id. Quam viverra feugiat
            vitae dignissim hendrerit fusce aliquam. Adipiscing neque vel ac
            odio.
            <br /> Dolor placerat tortor varius nunc, bibendum. Blandit arcu
            consectetur aliquam bibendum etiam. Facilisi dolor, non porttitor
            integer sagittis, vitae malesuada vehicula. Tortor convallis
            scelerisque fames auctor eros, sed. Quisque ullamcorper cras orci
            vitae. Arcu tellus amet, tristique fermentum vitae pellentesque. Sed
            odio tincidunt fermentum odio.Lacinia risus egestas posuere orci
            quisque felis, augue vitae ornare. Sit tempus nunc velit vel
            facilisi convallis integer lacus id. Tempus aliquam nisl dis in.
            Morbi quam massa quisque ut blandit ut ac ac feugiat. Facilisis
            tortor, elementum consectetur enim tristique. Libero aenean massa
            odio tristique ullamcorper nunc donec fusce. Dignissim in ante
            volutpat diam pharetra mauris vitae nam sem.
            <br />
            Nisl cursus vitae platea nulla maecenas. Sit euismod pretium,
            volutpat faucibus natoque non. Lorem amet velit in scelerisque eget
            laoreet morbi. Mattis ut donec commodo auctor pretium risus,
            convallis. Neque egestas aenean nulla sollicitudin ac enim.
            Elementum pellentesque nulla pretium vulputate. Nisl tincidunt sit
            id nisl elit aliquet pellentesque. Sit et massa nisl dictum.
            Tincidunt non, pellentesque tristique diam. Pellentesque tellus,
            ipsum amet sollicitudin sit. Vivamus ullamcorper imperdiet integer
            feugiat. Nulla dapibus sit vestibulum sit massa augue neque. Metus,
            turpis odio leo auctor adipiscing accumsan enim semper id.Volutpat
            neque, non sit duis leo. Sed vitae augue odio varius in sollicitudin
            etiam. Vestibulum elit massa pharetra, sed aliquet sem quisque.
            Nulla eget diam nullam tellus lacus, sem lorem lectus laoreet. Nisl,
            turpis odio turpis tellus. Morbi tincidunt nullam ultrices arcu
            dolor viverra consectetur libero. Pretium urna sit tellus sed varius
            pharetra.
            <br />
            Nam risus ultricies orci, volutpat sit adipiscing. Nec, volutpat
            consectetur enim pellentesque convallis. Quam nulla quis et in purus
            justo, feugiat in venenatis. Nisl lacus, bibendum egestas risus ut
            euismod commodo dignissim. Sagittis, vel enim, amet, facilisi
            phasellus. Aliquam non nec consectetur ullamcorper sagittis purus
            etiam in. Eleifend amet quam rhoncus, elit arcu, etiam felis
            ultrices. Hendrerit sit blandit massa rhoncus pretium a cras
            ultrices mauris. Risus, aenean nibh ac urna vulputate magna magna
            pretium in. Elit id odio urna blandit tortor, vestibulum felis vitae
            amet. Elementum morbi nunc, morbi egestas tellus amet facilisis
            vestibulum. Suscipit varius aliquam venenatis, dolor justo, semper
            tincidunt velit, sem. Enim sit vitae nulla parturient amet, risus.
            Lectus pellentesque amet, augue id volutpat, cras.
            <br />
            Ut tempus diam ultrices feugiat. Sed fringilla semper commodo, sed.
            Quis tortor lacinia nibh ultrices libero elit, quis et. Cursus
            luctus tellus in ac dui risus sit orci. Sapien enim at nunc
            sagittis. Euismod aliquet et convallis viverra. Facilisis a feugiat
            porttitor nunc turpis nunc. Dictumst sagittis ornare varius viverra.
            Eu, ullamcorper mauris lacus morbi elit.Justo et tempor, pretium, eu
            vestibulum lacus. Feugiat et amet maecenas convallis molestie sed.
            Dolor lectus nulla consectetur viverra scelerisque. Tellus nulla
            elementum tincidunt sed nulla. Nisi, id fringilla ipsum velit non.
            Vitae a morbi nisl viverra vel dui. Faucibus elementum nunc
            vestibulum vulputate feugiat.cus augue id.
          </h2>
        </div>
        <Footer />
      </div>
    </div>
  );
}
