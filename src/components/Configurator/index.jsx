import UI from "./components/UI";

function Configurator() {

  return (
    <div
      className={`min-h-screen w-full bg-[#090e18]
      bg-[radial-gradient(80rem_80rem_at_65%_0%,rgba(59,130,246,.18),transparent),radial-gradient(40rem_40rem_at_10%_100%,rgba(251,146,60,.12),transparent)]
      pt-8 px-4 md:px-3 `}
    >
      <UI />
    </div>
  );
}

export default Configurator