export default async ({ project }) => {
  const p = await project({
    dir: "/home/user/cabinet",
    size: "1280x720",
    fps: 24,
    background: "#F7F3ED",
  });
  const titles = [
    "L'accueil",
    "La salle d'attente",
    "La consultation",
    "L'espace EEG",
    "L'espace ENMG",
  ];
  const details = [
    "Bienvenue au cabinet",
    "Un espace pour vous accueillir",
    "Un temps d'écoute et d'échange",
    "L'activité électrique cérébrale",
    "Les nerfs et les muscles",
  ];
  for (let i = 0; i < 5; i++) {
    const img = await p.add("/home/user/" + (i + 1) + ".jpg");
    p.compose(
      <frame
        x={0}
        y={0}
        width={1280}
        height={720}
        layout="none"
        background="#F7F3ED"
      >
        <text
          x={64}
          y={58}
          width={535}
          height={40}
          fontFamily="Montserrat"
          fontSize={16}
          color="#80556F"
        >
          CABINET DE NEUROLOGIE · CASABLANCA
        </text>
        <text
          x={64}
          y={170}
          width={480}
          height={52}
          fontFamily="Montserrat"
          fontSize={18}
          color="#80556F"
        >
          0{i + 1} / 05
        </text>
        <text
          x={64}
          y={242}
          width={500}
          height={140}
          fontFamily="Montserrat"
          fontSize={46}
          fontWeight={600}
          color="#352C35"
          animate={[
            { property: "opacity", from: 0, to: 1, duration: 0.65 },
            { property: "offsetY", from: 15, to: 0, duration: 0.65 },
          ]}
        >
          {titles[i]}
        </text>
        <rect x={64} y={405} width={64} height={3} fill="#80556F" />
        <text
          x={64}
          y={440}
          width={490}
          height={80}
          fontFamily="Montserrat"
          fontSize={24}
          color="#6F656A"
        >
          {details[i]}
        </text>
        <text
          x={64}
          y={607}
          width={510}
          height={40}
          fontFamily="Montserrat"
          fontSize={22}
          fontWeight={600}
          color="#352C35"
        >
          Dr Soukaina ENNIGRO
        </text>
        <text
          x={64}
          y={647}
          width={530}
          height={28}
          fontFamily="Montserrat"
          fontSize={16}
          color="#6F656A"
        >
          Visite en images · +212 5 22 58 02 02
        </text>
        <frame
          x={680}
          y={24}
          width={538}
          height={672}
          layout="none"
          clip={true}
          radius={10}
        >
          <media
            x={0}
            y={0}
            file={img}
            width={538}
            height={672}
            fit="cover"
            animate={[
              {
                property: "scale",
                from: 1,
                to: 1.035,
                duration: 5,
                easing: "linear",
              },
              { property: "opacity", from: 0, to: 1, duration: 0.6 },
            ]}
          />
        </frame>
      </frame>,
      { at: i * 5, dur: 5, name: titles[i] },
    );
  }
  await p.frame(2, "/home/user/preview.png");
  await p.render("/home/user/tour.mp4", { bitrate: 2500000, concurrency: 2 });
};
