import { useEffect, useMemo, useRef, useState } from "react";
import battleMusic from "./assets/battle-song.mp3";
import battleScene from "./assets/alchemy-meadow-battle.png";
import cubeSummonEffect from "./assets/cube-summon-effect.png";
import dragonFireBreath from "./assets/dragon-fire-breath.png";
import heroGateMusic from "./assets/hero-gate.mp3";
import parchmentPanel from "./assets/parchment-panel.png";
import spellAcidSting from "./assets/spells/acid-sting.svg";
import spellAmmoniaVeil from "./assets/spells/ammonia-veil.svg";
import spellCarbonBurst from "./assets/spells/carbon-burst.svg";
import spellCarbonSmoke from "./assets/spells/carbon-smoke.svg";
import spellGlucoseNova from "./assets/spells/glucose-nova.svg";
import spellHydroSlash from "./assets/spells/hydro-slash.svg";
import spellMethaneInferno from "./assets/spells/methane-inferno.svg";
import spellNitroBarrier from "./assets/spells/nitro-barrier.svg";
import spellOxyBlade from "./assets/spells/oxy-blade.svg";
import spellOzoneSpark from "./assets/spells/ozone-spark.svg";
import spellPeroxideFlash from "./assets/spells/peroxide-flash.svg";
import spellWaterBomb from "./assets/spells/water-bomb.svg";
import "./App.css";

const DRAGON_MAX_HP = 18;
const DEFAULT_SPELL_ID = "hydro-slash";

const INITIAL_BAG = [
  ...Array(20).fill("H"),
  ...Array(18).fill("O"),
  ...Array(8).fill("C"),
  ...Array(8).fill("N"),
  ...Array(4).fill("Cl"),
  ...Array(8).fill("D"),
];

const SPELL_EFFECT_IMAGES = {
  "hydro-slash": spellHydroSlash,
  "oxy-blade": spellOxyBlade,
  "nitro-barrier": spellNitroBarrier,
  "carbon-smoke": spellCarbonSmoke,
  "carbon-burst": spellCarbonBurst,
  "ozone-spark": spellOzoneSpark,
  "water-bomb": spellWaterBomb,
  "peroxide-flash": spellPeroxideFlash,
  "methane-inferno": spellMethaneInferno,
  "ammonia-veil": spellAmmoniaVeil,
  "acid-sting": spellAcidSting,
  "glucose-nova": spellGlucoseNova,
};

const SPELL_SOUND_PROFILES = {
  "hydro-slash": { start: [620, 920, 1240], impact: [220, 330] },
  "oxy-blade": { start: [720, 1040, 1380], impact: [260, 420] },
  "nitro-barrier": { start: [360, 540, 720], impact: [180, 240] },
  "carbon-smoke": { start: [220, 300, 420], impact: [120, 180] },
  "carbon-burst": { start: [300, 520, 880], impact: [90, 150] },
  "ozone-spark": { start: [780, 1180, 1560], impact: [300, 620] },
  "water-bomb": { start: [520, 760, 980], impact: [160, 260] },
  "peroxide-flash": { start: [860, 1220, 1620], impact: [240, 480] },
  "methane-inferno": { start: [260, 440, 700], impact: [80, 130] },
  "ammonia-veil": { start: [420, 620, 860], impact: [140, 210] },
  "acid-sting": { start: [940, 1320, 1720], impact: [210, 360] },
  "glucose-nova": { start: [380, 760, 1140, 1520], impact: [110, 220, 440] },
};

const BACKGROUND_MUSIC = [
  { title: "전장의 노래", src: battleMusic },
  { title: "용사의 성문", src: heroGateMusic },
];

const ELEMENTS = {
  H: { name: "수소", label: "수소 H", short: "H" },
  O: { name: "산소", label: "산소 O", short: "O" },
  C: { name: "탄소", label: "탄소 C", short: "C" },
  N: { name: "질소", label: "질소 N", short: "N" },
  Cl: { name: "염소", label: "염소 Cl", short: "Cl" },
  D: { name: "드래곤", label: "드래곤 큐브", short: "D" },
};

function cubesFromRequirements(requiredCubes) {
  return Object.entries(requiredCubes).flatMap(([cube, count]) => Array(count).fill(cube));
}

function formatRequiredCubes(requiredCubes) {
  return Object.entries(requiredCubes)
    .map(([cube, count]) => `${ELEMENTS[cube]?.short ?? cube} × ${count}`)
    .join(", ");
}

function joinKoreanList(items) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  return `${items.slice(0, -1).join(", ")}와 ${items[items.length - 1]}`;
}

function getMoleculeSentence(spell) {
  const atomPhrases = Object.entries(spell.requiredCubes).map(
    ([cube, count]) => `${ELEMENTS[cube]?.name ?? cube} 원자 ${count}개`,
  );

  return `${spell.formula}는 ${joinKoreanList(atomPhrases)}로 이루어져 있습니다.`;
}

const SPELLS = [
  {
    id: "hydro-slash",
    formula: "H₂",
    name: "하이드로 슬래시",
    image: spellHydroSlash,
    requiredCubes: { H: 2 },
    damage: 1,
    difficulty: "쉬움",
    description: "수소 원자 2개를 모아 수소 기체 주문을 완성합니다.",
    attackDescription: "가벼운 수소 에너지가 날카로운 파동으로 변해 드래곤을 공격합니다.",
  },
  {
    id: "oxy-blade",
    formula: "O₂",
    name: "옥시 블레이드",
    image: spellOxyBlade,
    requiredCubes: { O: 2 },
    damage: 1,
    difficulty: "쉬움",
    description: "산소 원자 2개를 모아 산소 기체 주문을 완성합니다.",
    attackDescription: "맑은 산소의 칼날이 드래곤을 베어냅니다.",
  },
  {
    id: "nitro-barrier",
    formula: "N₂",
    name: "나이트로 배리어",
    image: spellNitroBarrier,
    requiredCubes: { N: 2 },
    damage: 2,
    difficulty: "보통",
    description: "질소 원자 2개를 모아 질소 기체 주문을 완성합니다.",
    attackDescription: "질소의 안정적인 장막이 드래곤의 공격을 밀어냅니다.",
  },
  {
    id: "carbon-smoke",
    formula: "CO",
    name: "카본 스모크",
    image: spellCarbonSmoke,
    requiredCubes: { C: 1, O: 1 },
    damage: 2,
    difficulty: "보통",
    description: "탄소 원자 1개와 산소 원자 1개로 일산화탄소 주문을 완성합니다.",
    attackDescription: "검은 연기가 퍼지며 드래곤의 시야를 가립니다.",
  },
  {
    id: "carbon-burst",
    formula: "CO₂",
    name: "카본 버스트",
    image: spellCarbonBurst,
    requiredCubes: { C: 1, O: 2 },
    damage: 3,
    difficulty: "보통",
    description: "탄소 원자 1개와 산소 원자 2개로 이산화탄소 주문을 완성합니다.",
    attackDescription: "압축된 탄소 에너지가 폭발하며 드래곤에게 피해를 줍니다.",
  },
  {
    id: "ozone-spark",
    formula: "O₃",
    name: "오존 스파크",
    image: spellOzoneSpark,
    requiredCubes: { O: 3 },
    damage: 3,
    difficulty: "보통",
    description: "산소 원자 3개로 오존 주문을 완성합니다.",
    attackDescription: "보라빛 오존 전격이 드래곤을 관통합니다.",
  },
  {
    id: "water-bomb",
    formula: "H₂O",
    name: "워터 밤",
    image: spellWaterBomb,
    requiredCubes: { H: 2, O: 1 },
    damage: 3,
    difficulty: "보통",
    description: "수소 원자 2개와 산소 원자 1개로 물 주문을 완성합니다.",
    attackDescription: "푸른 물 폭발이 드래곤을 밀어냅니다.",
  },
  {
    id: "peroxide-flash",
    formula: "H₂O₂",
    name: "퍼옥사이드 플래시",
    image: spellPeroxideFlash,
    requiredCubes: { H: 2, O: 2 },
    damage: 4,
    difficulty: "어려움",
    description: "수소 원자 2개와 산소 원자 2개로 과산화수소 주문을 완성합니다.",
    attackDescription: "하얀 빛과 거품이 터지며 드래곤을 공격합니다.",
  },
  {
    id: "methane-inferno",
    formula: "CH₄",
    name: "메테인 인페르노",
    image: spellMethaneInferno,
    requiredCubes: { C: 1, H: 4 },
    damage: 4,
    difficulty: "어려움",
    description: "탄소 원자 1개와 수소 원자 4개로 메테인 주문을 완성합니다.",
    attackDescription: "강한 화염 마법이 드래곤에게 직접 피해를 줍니다.",
  },
  {
    id: "ammonia-veil",
    formula: "NH₃",
    name: "암모니아 베일",
    image: spellAmmoniaVeil,
    requiredCubes: { N: 1, H: 3 },
    damage: 4,
    difficulty: "어려움",
    description: "질소 원자 1개와 수소 원자 3개로 암모니아 주문을 완성합니다.",
    attackDescription: "녹색 안개가 퍼지며 드래곤을 약화시킵니다.",
  },
  {
    id: "acid-sting",
    formula: "HCl",
    name: "애시드 스팅",
    image: spellAcidSting,
    requiredCubes: { H: 1, Cl: 1 },
    damage: 5,
    difficulty: "희귀",
    description: "수소 큐브 1개와 염소 큐브 1개로 염화수소 주문을 완성합니다. Cl 큐브가 희귀하기 때문에 완성 난이도가 높습니다.",
    attackDescription: "산성 마법 화살이 드래곤의 비늘을 부식시켜 큰 피해를 줍니다.",
  },
  {
    id: "glucose-nova",
    formula: "C₆H₁₂O₆",
    name: "글루코스 노바",
    image: spellGlucoseNova,
    requiredCubes: { C: 6, H: 12, O: 6 },
    damage: 10,
    difficulty: "필살기",
    description: "탄소 6개, 수소 12개, 산소 6개로 포도당 주문을 완성합니다.",
    attackDescription: "거대한 생명 에너지가 폭발하며 드래곤에게 치명타를 줍니다.",
  },
];

const GUIDE_SECTIONS = [
  {
    title: "게임 목표",
    body: "화학 마법사가 되어 원자 큐브를 모으고 분자식 주문을 완성합니다. 주문이 성공하면 드래곤 체력이 줄어듭니다.",
  },
  {
    title: "원자 큐브란?",
    body: "수소 H, 산소 O, 탄소 C, 질소 N, 염소 Cl 큐브는 각각 원자 하나를 뜻합니다. 드래곤 큐브는 위험 큐브입니다.",
  },
  {
    title: "차례 진행 방법",
    body: "자기 차례에는 큐브를 계속 뽑거나 멈출 수 있습니다. 멈추면 마지막 큐브 1개는 버리고 나머지를 보관합니다.",
  },
  {
    title: "드래곤 큐브의 위험",
    body: "드래곤 큐브가 나오면 이번 차례에 뽑은 원자 큐브를 모두 잃습니다. 많이 뽑을수록 보상과 위험이 함께 커집니다.",
  },
  {
    title: "주문 카드와 분자식",
    body: "주문 카드는 H₂, CO₂, H₂O 같은 분자식입니다. 보관 큐브가 분자식에 필요한 원자 큐브 조건을 만족하면 주문을 시전할 수 있습니다.",
  },
  {
    title: "분자식 분석",
    body: "분자식은 원자의 종류와 개수를 기호와 작은 숫자로 나타낸 것입니다. 분석 패널에서 필요한 큐브를 확인하세요.",
  },
  {
    title: "승리와 패배 조건",
    body: "드래곤 체력을 0으로 만들면 승리합니다. 드래곤을 물리치기 전에 주머니 큐브가 모두 떨어지면 패배합니다.",
  },
];

const GAME_GUIDE_SECTIONS = [
  { title: "게임 목표", body: "원자 큐브를 모아 분자식 주문을 완성하고 드래곤 체력을 0으로 만드세요." },
  { title: "큐브 설명", body: "H는 수소, O는 산소, C는 탄소, N은 질소, Cl은 염소입니다. D는 이번 차례 큐브를 잃게 하는 드래곤 큐브입니다." },
  { title: "차례 진행 방법", body: "큐브를 뽑다가 멈추면 마지막 큐브 1개를 버리고 나머지를 보관합니다." },
  { title: "드래곤 큐브 규칙", body: "D가 나오면 D와 이번 차례 원자 큐브가 모두 버린 큐브로 이동합니다." },
  { title: "주문 카드 사용 방법", body: "보관 큐브가 주문 카드의 분자식 조건을 만족하면 주문 시전 버튼이 활성화됩니다." },
  { title: "분자식 학습 포인트", body: "분자식의 아래 작은 숫자는 그 원자가 몇 개 들어 있는지 보여줍니다. 예를 들어 H₂O는 H 2개와 O 1개가 필요합니다." },
  { title: "승리와 패배", body: "주문 피해로 드래곤 체력을 0으로 만들면 승리, 주머니가 먼저 비면 패배입니다." },
];

const TUTORIAL_STEPS = [
  {
    title: "1. 게임 목표",
    text: "원자 큐브를 모아 분자식 주문을 완성하고 드래곤의 체력을 0으로 만드세요.",
    highlight: "goal",
  },
  {
    title: "2. 원자 큐브",
    text: "H는 수소, O는 산소, C는 탄소, N은 질소, Cl은 염소입니다. 큐브 하나는 원자 하나를 뜻합니다.",
    highlight: "cubes",
  },
  {
    title: "3. 분자식 주문",
    text: "H₂, CO₂, H₂O처럼 표시된 분자식이 주문 카드입니다. 분자식에 적힌 원자 수만큼 큐브를 모아야 합니다.",
    highlight: "spell",
  },
  {
    title: "4. 예시",
    text: "H₂O 주문은 H 큐브 2개와 O 큐브 1개가 필요합니다. CO₂ 주문은 C 큐브 1개와 O 큐브 2개가 필요합니다.",
    highlight: "analysis",
  },
  {
    title: "5. 큐브 뽑기",
    text: "자기 차례에는 큐브를 원하는 만큼 뽑을 수 있습니다. 많이 뽑으면 주문을 완성하기 쉬워집니다.",
    highlight: "draw",
  },
  {
    title: "6. 멈추기",
    text: "멈추면 마지막으로 뽑은 원자 큐브 1개는 버리고, 나머지 큐브는 보관합니다.",
    highlight: "stop",
  },
  {
    title: "7. 드래곤 큐브",
    text: "드래곤 큐브가 나오면 이번 차례에 뽑은 원자 큐브를 모두 잃습니다.",
    highlight: "dragon",
  },
  {
    title: "8. 주문 시전",
    text: "보관한 큐브가 분자식의 필요 큐브를 만족하면 주문을 시전해 드래곤에게 피해를 줄 수 있습니다.",
    highlight: "spell",
  },
  {
    title: "9. 승리 조건",
    text: "드래곤 체력을 0으로 만들면 승리합니다. 주머니가 먼저 비면 패배합니다.",
    highlight: "win",
  },
];

const MOBILE_TABS = [
  { id: "status", label: "상태" },
  { id: "spells", label: "주문" },
  { id: "analysis", label: "분석" },
  { id: "log", label: "기록" },
];

export function shuffle(array) {
  const result = [...array];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function countCubes(cubes) {
  return cubes.reduce(
    (counts, cube) => ({
      ...counts,
      [cube]: (counts[cube] ?? 0) + 1,
    }),
    {},
  );
}

export function countElements(cubes) {
  return countCubes(cubes);
}

export function canCastSpell(spell, keptCubes) {
  const keptCounts = countCubes(keptCubes);

  return Object.entries(spell.requiredCubes).every(([cube, required]) => (keptCounts[cube] ?? 0) >= required);
}

function getMissingCubes(spell, keptCubes) {
  const keptCounts = countCubes(keptCubes);

  return Object.entries(spell.requiredCubes)
    .map(([cube, required]) => ({
      cube,
      required,
      current: keptCounts[cube] ?? 0,
      missing: Math.max(required - (keptCounts[cube] ?? 0), 0),
    }))
    .filter((item) => item.missing > 0);
}

function removeRequiredCubes(keptCubes, requiredCubes) {
  const remainingRequirements = { ...requiredCubes };
  const remaining = [];
  const used = [];

  for (const cube of keptCubes) {
    if ((remainingRequirements[cube] ?? 0) > 0) {
      remainingRequirements[cube] -= 1;
      used.push(cube);
    } else {
      remaining.push(cube);
    }
  }

  return { remaining, used };
}

function ElementCube({ type, small = false, muted = false }) {
  const info = ELEMENTS[type] ?? ELEMENTS.H;

  return (
    <span
      className={`element-cube cube-${type.toLowerCase()}${small ? " is-small" : ""}${muted ? " is-muted" : ""}`}
      aria-label={info.label}
      title={info.label}
    >
      <span>{info.short}</span>
    </span>
  );
}

function CubeGroup({ cubes, emptyText, compact = false }) {
  if (cubes.length === 0) {
    return <p className="empty-cubes">{emptyText}</p>;
  }

  return (
    <div className={`cube-row${compact ? " is-compact" : ""}`}>
      {cubes.map((cube, index) => (
        <ElementCube key={`${cube}-${index}`} type={cube} small={compact} />
      ))}
    </div>
  );
}

function CubeCounts({ counts, includeDragon = false }) {
  const cubeTypes = includeDragon ? ["H", "O", "C", "N", "Cl", "D"] : ["H", "O", "C", "N", "Cl"];

  return (
    <div className="cube-count-grid">
      {cubeTypes.map((cube) => (
        <div key={cube} className="cube-count">
          <ElementCube type={cube} small />
          <span>{counts[cube] ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

function BattleScene({ dragonHp, animationState, showTitle = false, attackCubes = [], attackEffectSrc = spellHydroSlash }) {
  const hpPercent = Math.max(0, Math.min(100, (dragonHp / DRAGON_MAX_HP) * 100));

  return (
    <div className={`battle-scene ${animationState ? `is-${animationState}` : ""}`}>
      <div className="scene-image" />
      <div className="scene-vignette" />
      <div className="wizard-shake-slice" aria-hidden="true" />
      <img className="dragon-breath-effect" src={dragonFireBreath} alt="" aria-hidden="true" />
      <div className="cube-summon-layer" aria-hidden="true">
        <img className="cube-summon-effect" src={cubeSummonEffect} alt="" />
        <div className="summoned-cubes">
          {attackCubes.slice(0, 9).map((cube, index) => (
            <span
              key={`${cube}-${index}`}
              className="summoned-cube-wrap"
              style={{
                "--summon-index": index,
                "--summon-delay": `${120 + index * 125}ms`,
                "--summon-x": `${(index % 3) * 34 - 34}px`,
                "--summon-y": `${Math.floor(index / 3) * 30 - 30}px`,
              }}
            >
              <ElementCube type={cube} small />
            </span>
          ))}
        </div>
      </div>
      <div className="spell-attack-layer" aria-hidden="true">
        <img className="spell-projectile-image" src={attackEffectSrc} alt="" />
        <img className="spell-impact-image" src={attackEffectSrc} alt="" />
      </div>
      <span className="magic-particle particle-one" />
      <span className="magic-particle particle-two" />
      <span className="magic-particle particle-three" />
      {showTitle ? null : (
        <div className="hp-panel">
          <div className="hp-label">
            <span>드래곤 체력</span>
            <strong>
              {dragonHp} / {DRAGON_MAX_HP}
            </strong>
          </div>
          <div className="hp-track" aria-label="드래곤 체력">
            <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function StartScreen({ onGuide }) {
  return (
    <section className="screen start-screen">
      <BattleScene dragonHp={DRAGON_MAX_HP} showTitle />
      <div className="start-copy">
        <p className="teacher-note">중학교 과학 · 분자식 학습 게임</p>
        <h1>케미술사: 드래곤의 분자식</h1>
        <p>원자 큐브를 모아 분자식 주문을 완성하고 드래곤을 물리치세요.</p>
        <div className="button-row">
          <button className="fantasy-button primary" type="button" onClick={onGuide}>
            게임 시작
          </button>
          <button className="fantasy-button secondary" type="button" onClick={onGuide}>
            게임 설명 보기
          </button>
        </div>
      </div>
    </section>
  );
}

function GuideScreen({ guideTopic, setGuideTopic, onBack, onTutorial, onPlay }) {
  const selected = GUIDE_SECTIONS[guideTopic];

  return (
    <section className="screen guide-screen">
      <div className="screen-heading">
        <div>
          <p className="teacher-note">처음 플레이하는 학생을 위한 안내</p>
          <h1>게임 상세 설명</h1>
        </div>
        <div className="button-row">
          <button className="fantasy-button secondary" type="button" onClick={onBack}>
            이전
          </button>
          <button className="fantasy-button primary" type="button" onClick={onTutorial}>
            튜토리얼 시작
          </button>
          <button className="fantasy-button ghost" type="button" onClick={onPlay}>
            바로 게임 시작
          </button>
        </div>
      </div>
      <div className="guide-grid">
        <div className="guide-topic-grid" role="tablist" aria-label="게임 상세 설명 항목">
          {GUIDE_SECTIONS.map((section, index) => (
            <button
              key={section.title}
              className={`guide-topic ${guideTopic === index ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={guideTopic === index}
              onClick={() => setGuideTopic(index)}
            >
              <span>{index + 1}</span>
              <strong>{section.title}</strong>
            </button>
          ))}
        </div>
        <article className="parchment-card guide-detail">
          <h2>{selected.title}</h2>
          <p>{selected.body}</p>
          <div className="guide-visual-row">
            <ElementCube type="H" />
            <ElementCube type="O" />
            <ElementCube type="C" />
            <ElementCube type="N" />
            <ElementCube type="Cl" />
            <ElementCube type="D" />
          </div>
          <p className="science-note">분자식은 원자의 종류와 개수를 기호로 나타낸 것입니다.</p>
        </article>
      </div>
    </section>
  );
}

function TutorialScreen({ step, setStep, onBack, onPlay }) {
  const current = TUTORIAL_STEPS[step];

  return (
    <section className="screen tutorial-screen">
      <div className="tutorial-stage">
        <div className="tutorial-mock-board" aria-hidden="true">
          <div className={`mock-dragon ${current.highlight === "dragon" || current.highlight === "win" ? "is-highlighted" : ""}`} />
          <div className={`mock-hp ${current.highlight === "goal" || current.highlight === "win" ? "is-highlighted" : ""}`} />
          <div className={`mock-cubes ${current.highlight === "cubes" ? "is-highlighted" : ""}`}>
            <ElementCube type="H" />
            <ElementCube type="O" />
            <ElementCube type="C" />
            <ElementCube type="N" />
            <ElementCube type="Cl" />
          </div>
          <div className={`mock-buttons ${current.highlight === "draw" || current.highlight === "stop" ? "is-highlighted" : ""}`}>
            <span>큐브 뽑기</span>
            <span>멈추기</span>
          </div>
          <div className={`mock-spell ${current.highlight === "spell" || current.highlight === "analysis" ? "is-highlighted" : ""}`}>
            <strong>H₂O</strong>
            <small>분자식 분석</small>
          </div>
        </div>
        <article className="parchment-card tutorial-card" key={current.title}>
          <p className="teacher-note">튜토리얼</p>
          <h1>{current.title}</h1>
          <p>{current.text}</p>
          <div className="tutorial-dots" aria-label="튜토리얼 진행 상태">
            {TUTORIAL_STEPS.map((item, index) => (
              <button
                key={item.title}
                className={index === step ? "is-active" : ""}
                type="button"
                aria-label={`${index + 1}단계`}
                onClick={() => setStep(index)}
              />
            ))}
          </div>
          <div className="button-row">
            <button
              className="fantasy-button secondary"
              type="button"
              onClick={() => (step === 0 ? onBack() : setStep((currentStep) => currentStep - 1))}
            >
              이전
            </button>
            <button
              className="fantasy-button secondary"
              type="button"
              onClick={() => setStep((currentStep) => Math.min(TUTORIAL_STEPS.length - 1, currentStep + 1))}
              disabled={step === TUTORIAL_STEPS.length - 1}
            >
              다음
            </button>
            <button className="fantasy-button ghost" type="button" onClick={onPlay}>
              건너뛰기
            </button>
            <button className="fantasy-button primary" type="button" onClick={onPlay}>
              게임 시작
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function SpellCard({ spell, selected, castable, missing, onSelect }) {
  const requiredCubeList = cubesFromRequirements(spell.requiredCubes);

  return (
    <button
      className={`spell-card ${selected ? "is-selected" : ""}${castable ? " is-castable" : " is-locked"}`}
      type="button"
      onClick={onSelect}
    >
      <span className="spell-card-top">
        <span className="spell-card-title">
          <strong>{spell.name}</strong>
          <span className="spell-damage-badge">공격력 {spell.damage}</span>
        </span>
        <span>난이도 {spell.difficulty}</span>
      </span>
      <small>분자식 {spell.formula}</small>
      <span className="spell-art-frame">
        <img className="spell-art" src={spell.image} alt={`${spell.name} 주문 이미지`} />
      </span>
      <em>필요 큐브: {formatRequiredCubes(spell.requiredCubes)}</em>
      <span className="mini-cubes">
        {requiredCubeList.map((cube, index) => (
          <ElementCube key={`${spell.id}-${cube}-${index}`} type={cube} small muted={!castable} />
        ))}
      </span>
      <span className="spell-card-explanation">{spell.description}</span>
      <span className="spell-card-attack">{spell.attackDescription}</span>
      {missing.length > 0 ? (
        <span className="missing-line">
          부족한 큐브:{" "}
          {missing.map((item) => `${ELEMENTS[item.cube].short} ${item.missing}개`).join(", ")}
        </span>
      ) : (
        <span className="ready-line">주문 시전 가능</span>
      )}
    </button>
  );
}

function ReactionAnalysis({ spell, missing, castable, onCast, animationState, mobileActive }) {
  const requiredCubeList = cubesFromRequirements(spell.requiredCubes);
  const requirementRows = Object.entries(spell.requiredCubes);

  return (
    <section className={`game-panel analysis-panel ${animationState === "cast" ? "is-casting" : ""}`} data-mobile-active={mobileActive}>
      <div className="panel-heading">
        <div>
          <span>선택한 주문</span>
          <h2>{spell.name}</h2>
        </div>
        <button className="fantasy-button primary cast-button" type="button" disabled={!castable} onClick={() => onCast(spell)}>
          주문 시전
        </button>
      </div>
      <div className="formula-banner">분자식: {spell.formula}</div>
      <p className="science-note">분자식은 원자의 종류와 개수를 기호로 나타낸 것입니다.</p>
      <p className="spell-explanation">{getMoleculeSentence(spell)}</p>
      <p className="spell-explanation">{spell.description}</p>
      {missing.length > 0 ? (
        <p className="warning-text">
          부족한 큐브: {missing.map((item) => `${ELEMENTS[item.cube].short} ${item.missing}개`).join(", ")}
        </p>
      ) : (
        <p className="success-text">주문 시전 가능</p>
      )}
      <div className="reaction-arrangement">
        <div>
          <strong>필요 원자 큐브</strong>
          <CubeGroup cubes={requiredCubeList} compact emptyText="필요 큐브가 없습니다." />
        </div>
        <div>
          <strong>공격 설명</strong>
          <p>{spell.attackDescription}</p>
        </div>
      </div>
      <div className="atom-panel">
        <h3>분자식 분석</h3>
        <table>
          <thead>
            <tr>
              <th>원자 큐브</th>
              <th>필요 개수</th>
            </tr>
          </thead>
          <tbody>
            {requirementRows.map(([cube, count]) => (
              <tr key={cube} className="is-matching">
                <td>{ELEMENTS[cube]?.label ?? cube}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="match-message">필요 큐브: {formatRequiredCubes(spell.requiredCubes)}</p>
      </div>
    </section>
  );
}

function GameGuideModal({ guideTopic, setGuideTopic, onClose }) {
  const selected = GAME_GUIDE_SECTIONS[guideTopic];

  return (
    <div className="guide-modal-backdrop" role="presentation">
      <section className="guide-modal parchment-card" role="dialog" aria-modal="true" aria-labelledby="game-guide-title">
        <div className="modal-heading">
          <h2 id="game-guide-title">게임 설명</h2>
          <button className="fantasy-button secondary" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="modal-tabs" role="tablist" aria-label="게임 설명 항목">
          {GAME_GUIDE_SECTIONS.map((section, index) => (
            <button
              key={section.title}
              className={guideTopic === index ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={guideTopic === index}
              onClick={() => setGuideTopic(index)}
            >
              {section.title}
            </button>
          ))}
        </div>
        <article className="modal-copy">
          <h3>{selected.title}</h3>
          <p>{selected.body}</p>
        </article>
      </section>
    </div>
  );
}

function GameScreen({
  bag,
  keptCubes,
  turnCubes,
  discardedCubes,
  dragonHp,
  selectedSpell,
  selectedSpellId,
  setSelectedSpellId,
  message,
  eventLog,
  animationState,
  mobileTab,
  setMobileTab,
  showGameGuide,
  setShowGameGuide,
  guideTopic,
  setGuideTopic,
  drawCube,
  stopDrawing,
  castSpell,
  resetGame,
  changeScreen,
}) {
  const keptCounts = useMemo(() => countCubes(keptCubes), [keptCubes]);
  const discardedCounts = useMemo(() => countCubes(discardedCubes), [discardedCubes]);
  const selectedMissing = useMemo(() => getMissingCubes(selectedSpell, keptCubes), [keptCubes, selectedSpell]);
  const selectedCanCast = selectedMissing.length === 0;

  return (
    <section className={`screen game-screen ${animationState ? `is-${animationState}` : ""}`}>
      <header className="game-header">
        <div>
          <p className="teacher-note">중학교 과학 · 분자식 주문 전투</p>
          <h1>케미술사: 드래곤의 분자식</h1>
        </div>
        <div className="button-row">
          <button className="fantasy-button secondary" type="button" onClick={() => setShowGameGuide(true)}>
            게임 설명
          </button>
          <button className="fantasy-button secondary" type="button" onClick={() => changeScreen("tutorial")}>
            튜토리얼 다시 보기
          </button>
          <button className="fantasy-button ghost" type="button" onClick={() => resetGame("game")}>
            다시 시작
          </button>
        </div>
      </header>
      <BattleScene
        dragonHp={dragonHp}
        animationState={animationState}
        attackCubes={cubesFromRequirements(selectedSpell.requiredCubes)}
        attackEffectSrc={selectedSpell.image ?? SPELL_EFFECT_IMAGES[selectedSpell.id] ?? spellHydroSlash}
      />
      <div className="compact-tabs" role="tablist" aria-label="게임 패널">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={mobileTab === tab.id ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab.id}
            onClick={() => setMobileTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <main className="game-board">
        <section className="game-panel status-panel" data-mobile-active={mobileTab === "status"}>
          <div className="panel-heading">
            <div>
              <span>상태</span>
              <h2>원자 주머니</h2>
            </div>
            <strong className="bag-count">남은 큐브 {bag.length}</strong>
          </div>
          <div className="status-metrics">
            <div>
              <span>보관 큐브</span>
              <strong>{keptCubes.length}</strong>
            </div>
            <div>
              <span>이번 차례 큐브</span>
              <strong>{turnCubes.length}</strong>
            </div>
            <div>
              <span>버린 큐브</span>
              <strong>{discardedCubes.length}</strong>
            </div>
          </div>
          <div className="action-grid">
            <button className="fantasy-button primary" type="button" onClick={drawCube} disabled={bag.length === 0}>
              큐브 뽑기
            </button>
            <button className="fantasy-button secondary" type="button" onClick={stopDrawing}>
              멈추기
            </button>
          </div>
          <div className="inventory-block">
            <div className="mini-heading">
              <strong>보관 큐브</strong>
              <span>분자식 재료</span>
            </div>
            <CubeCounts counts={keptCounts} />
          </div>
          <div className="inventory-block">
            <div className="mini-heading">
              <strong>이번 차례 큐브</strong>
              <span>멈추면 마지막 큐브는 버림</span>
            </div>
            <CubeGroup cubes={turnCubes} emptyText="아직 뽑은 큐브가 없습니다." />
          </div>
          <div className="inventory-block">
            <div className="mini-heading">
              <strong>버린 큐브</strong>
              <span>드래곤 큐브 포함</span>
            </div>
            <CubeCounts counts={discardedCounts} includeDragon />
          </div>
        </section>
        <section className="game-panel spell-panel" data-mobile-active={mobileTab === "spells"}>
          <div className="panel-heading">
            <div>
              <span>주문 카드</span>
              <h2>분자식 주문</h2>
            </div>
          </div>
          <div className="spell-grid">
            {SPELLS.map((spell) => {
              const missing = getMissingCubes(spell, keptCubes);
              return (
                <SpellCard
                  key={spell.id}
                  spell={spell}
                  selected={selectedSpellId === spell.id}
                  castable={missing.length === 0}
                  missing={missing}
                  onSelect={() => setSelectedSpellId(spell.id)}
                />
              );
            })}
          </div>
        </section>
        <ReactionAnalysis
          spell={selectedSpell}
          missing={selectedMissing}
          castable={selectedCanCast}
          onCast={castSpell}
          animationState={animationState}
          mobileActive={mobileTab === "analysis"}
        />
        <section className="game-panel feedback-panel" data-mobile-active={mobileTab === "log"}>
          <div className="panel-heading">
            <div>
              <span>사건 기록</span>
              <h2>주문 기록</h2>
            </div>
          </div>
          <div className={`message-banner ${animationState === "danger" ? "is-danger" : ""}`}>{message}</div>
          <div className="event-log" aria-live="polite">
            {eventLog.map((event) => (
              <p key={event.id} className={`event-line event-${event.type}`}>
                {event.text}
              </p>
            ))}
          </div>
        </section>
      </main>
      {showGameGuide ? (
        <GameGuideModal guideTopic={guideTopic} setGuideTopic={setGuideTopic} onClose={() => setShowGameGuide(false)} />
      ) : null}
    </section>
  );
}

function ResultScreen({ gameStatus, castHistory, usedElementHistory, bag, resetGame, changeScreen }) {
  const won = gameStatus === "win";
  const usedCounts = countCubes(usedElementHistory);
  const mostUsed = Object.entries(usedCounts).sort((a, b) => b[1] - a[1])[0];
  const mostUsedText = mostUsed ? `${ELEMENTS[mostUsed[0]].label} · ${mostUsed[1]}개` : "아직 사용한 큐브가 없습니다.";

  return (
    <section className={`screen result-screen ${won ? "is-win" : "is-lose"}`}>
      <BattleScene dragonHp={won ? 0 : DRAGON_MAX_HP} animationState={won ? "win" : "lose"} showTitle />
      <article className="parchment-card result-card">
        <p className="teacher-note">{won ? "분자식 주문 성공" : "전략 다시 세우기"}</p>
        <h1>{won ? "승리! 분자식 주문으로 드래곤을 물리쳤습니다." : "패배! 주머니의 큐브가 모두 떨어졌습니다."}</h1>
        {won ? (
          <p>원자 큐브를 모아 분자식을 완성하며 드래곤에게 강력한 주문을 시전했습니다.</p>
        ) : (
          <p>다음에는 너무 오래 뽑기보다 적절한 순간에 멈추는 전략이 필요합니다.</p>
        )}
        <div className="result-stats">
          <div>
            <span>시전한 주문</span>
            <strong>{castHistory.length}회</strong>
          </div>
          <div>
            <span>남은 큐브</span>
            <strong>{bag.length}개</strong>
          </div>
          <div>
            <span>가장 많이 사용한 원자 큐브</span>
            <strong>{mostUsedText}</strong>
          </div>
        </div>
        <p className="science-note">분자식은 원자의 종류와 개수를 기호로 나타낸 것입니다.</p>
        <div className="button-row">
          <button className="fantasy-button primary" type="button" onClick={() => resetGame("game")}>
            다시 시작
          </button>
          <button className="fantasy-button secondary" type="button" onClick={() => changeScreen("start")}>
            처음으로
          </button>
        </div>
      </article>
    </section>
  );
}

export default function App() {
  const musicAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const [screen, setScreen] = useState("start");
  const [screenKey, setScreenKey] = useState(0);
  const [bag, setBag] = useState(() => shuffle(INITIAL_BAG));
  const [turnCubes, setTurnCubes] = useState([]);
  const [keptCubes, setKeptCubes] = useState([]);
  const [discardedCubes, setDiscardedCubes] = useState([]);
  const [dragonHp, setDragonHp] = useState(DRAGON_MAX_HP);
  const [selectedSpellId, setSelectedSpellId] = useState(DEFAULT_SPELL_ID);
  const [message, setMessage] = useState("원자 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.");
  const [gameStatus, setGameStatus] = useState("playing");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showGameGuide, setShowGameGuide] = useState(false);
  const [eventLog, setEventLog] = useState([
    {
      id: "start-message",
      text: "원자 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.",
      type: "info",
    },
  ]);
  const [animationState, setAnimationState] = useState(null);
  const [guideTopic, setGuideTopic] = useState(0);
  const [mobileTab, setMobileTab] = useState("status");
  const [castHistory, setCastHistory] = useState([]);
  const [usedElementHistory, setUsedElementHistory] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicTrackIndex, setMusicTrackIndex] = useState(0);

  const selectedSpell = useMemo(
    () => SPELLS.find((spell) => spell.id === selectedSpellId) ?? SPELLS[0],
    [selectedSpellId],
  );

  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = 0.34;
    if (!isMusicOn) {
      audio.pause();
      return;
    }

    const playRequest = audio.play();
    if (playRequest) {
      playRequest.catch(() => setIsMusicOn(false));
    }
  }, [isMusicOn, musicTrackIndex]);

  function getAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    return audioContextRef.current;
  }

  function playTone(context, frequency, startTime, duration, type = "sine", volume = 0.08) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function playNoise(context, startTime, duration, volume = 0.08, filterFrequency = 900) {
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFrequency, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startTime);
    source.stop(startTime + duration);
  }

  function playSfx(type, spellId = null) {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const spellProfile = spellId ? SPELL_SOUND_PROFILES[spellId] : null;

    if (type === "draw") {
      playTone(context, 660, now, 0.08, "triangle", 0.05);
      playTone(context, 940, now + 0.04, 0.1, "sine", 0.04);
      return;
    }

    if (type === "save") {
      playTone(context, 520, now, 0.1, "triangle", 0.05);
      playTone(context, 780, now + 0.08, 0.12, "triangle", 0.05);
      return;
    }

    if (type === "danger") {
      playNoise(context, now, 0.42, 0.12, 520);
      playTone(context, 96, now, 0.46, "sawtooth", 0.09);
      playTone(context, 150, now + 0.12, 0.28, "square", 0.045);
      return;
    }

    if (type === "cast") {
      if (spellProfile) {
        spellProfile.start.forEach((frequency, index) => {
          playTone(context, frequency, now + index * 0.075, 0.16, index % 2 === 0 ? "triangle" : "sine", 0.048);
        });
        playNoise(context, now + 0.18, 0.28, 0.045, 1500 + spellProfile.start.length * 120);
        return;
      }

      playTone(context, 440, now, 0.12, "triangle", 0.05);
      playTone(context, 660, now + 0.08, 0.12, "triangle", 0.05);
      playTone(context, 990, now + 0.16, 0.18, "sine", 0.055);
      playNoise(context, now + 0.16, 0.32, 0.055, 1600);
      return;
    }

    if (type === "impact") {
      if (spellProfile) {
        playNoise(context, now, 0.34, 0.12, 680);
        spellProfile.impact.forEach((frequency, index) => {
          playTone(context, frequency, now + index * 0.045, 0.24, "sawtooth", 0.055);
        });
        return;
      }

      playNoise(context, now, 0.34, 0.12, 720);
      playTone(context, 180, now, 0.26, "sawtooth", 0.065);
      return;
    }

    playTone(context, 190, now, 0.14, "square", 0.045);
  }

  function startMusic() {
    setIsMusicOn(true);
    getAudioContext();
    const audio = musicAudioRef.current;
    if (audio) {
      audio.volume = 0.34;
      const playRequest = audio.play();
      if (playRequest) {
        playRequest.catch(() => setIsMusicOn(false));
      }
    }
  }

  function toggleMusic() {
    if (isMusicOn) {
      musicAudioRef.current?.pause();
      setIsMusicOn(false);
      return;
    }

    startMusic();
  }

  function changeScreen(nextScreen) {
    setShowGameGuide(false);
    setScreen(nextScreen);
    setScreenKey((key) => key + 1);
  }

  function addEventLog(logMessage, type = "info") {
    const event = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: logMessage,
      type,
    };

    setMessage(logMessage);
    setEventLog((previous) => [event, ...previous].slice(0, 7));
  }

  function triggerAnimation(nextAnimation) {
    setAnimationState(nextAnimation);
    const duration = nextAnimation === "cast" ? 3200 : nextAnimation === "danger" ? 900 : 620;
    window.setTimeout(() => {
      setAnimationState(null);
    }, duration);
  }

  function finishGame(nextStatus, resultMessage) {
    setGameStatus(nextStatus);
    addEventLog(resultMessage, nextStatus === "win" ? "success" : "danger");
    window.setTimeout(() => changeScreen("result"), 520);
  }

  function resetGame(nextScreen = "game") {
    const startMessage = "원자 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.";
    setBag(shuffle(INITIAL_BAG));
    setTurnCubes([]);
    setKeptCubes([]);
    setDiscardedCubes([]);
    setDragonHp(DRAGON_MAX_HP);
    setSelectedSpellId(DEFAULT_SPELL_ID);
    setMessage(startMessage);
    setGameStatus("playing");
    setTutorialStep(0);
    setShowGameGuide(false);
    setEventLog([{ id: `reset-${Date.now()}`, text: startMessage, type: "info" }]);
    setAnimationState(null);
    setGuideTopic(0);
    setMobileTab("status");
    setCastHistory([]);
    setUsedElementHistory([]);
    changeScreen(nextScreen);
  }

  function drawCube() {
    if (gameStatus !== "playing") {
      return;
    }

    if (bag.length === 0) {
      finishGame("lose", "패배! 주머니의 큐브가 모두 떨어졌습니다.");
      return;
    }

    const [drawnCube, ...remainingBag] = bag;
    setBag(remainingBag);

    if (drawnCube === "D") {
      const lostCubes = [...turnCubes];
      setDiscardedCubes((previous) => [...previous, "D", ...lostCubes]);
      setTurnCubes([]);
      playSfx("danger");
      triggerAnimation("danger");
      addEventLog("드래곤 큐브를 뽑았습니다! 이번 차례에 뽑은 원자 큐브를 모두 잃었습니다.", "danger");

      if (remainingBag.length === 0 && dragonHp > 0) {
        finishGame("lose", "패배! 주머니의 큐브가 모두 떨어졌습니다.");
      }
      return;
    }

    setTurnCubes((previous) => [...previous, drawnCube]);
    playSfx("draw");
    triggerAnimation("draw");
    addEventLog(`${ELEMENTS[drawnCube].name} 큐브를 뽑았습니다. 계속 뽑거나 멈추세요.`, "draw");

    if (remainingBag.length === 0 && dragonHp > 0) {
      finishGame("lose", "패배! 주머니의 큐브가 모두 떨어졌습니다.");
    }
  }

  function stopDrawing() {
    if (gameStatus !== "playing") {
      return;
    }

    if (turnCubes.length === 0) {
      playSfx("missing");
      triggerAnimation("missing");
      addEventLog("보관할 큐브가 없습니다. 먼저 큐브를 뽑으세요.", "warning");
      return;
    }

    const savedCubes = turnCubes.slice(0, -1);
    const discardedCube = turnCubes[turnCubes.length - 1];
    setKeptCubes((previous) => [...previous, ...savedCubes]);
    setDiscardedCubes((previous) => [...previous, discardedCube]);
    setTurnCubes([]);
    playSfx("save");
    triggerAnimation("save");

    if (savedCubes.length > 0) {
      addEventLog(
        `멈췄습니다. 마지막 ${ELEMENTS[discardedCube].name} 큐브 1개를 버리고 ${savedCubes.length}개를 보관했습니다.`,
        "save",
      );
    } else {
      addEventLog(
        `멈췄습니다. 마지막 ${ELEMENTS[discardedCube].name} 큐브 1개를 버렸습니다. 보관한 큐브는 없습니다.`,
        "save",
      );
    }

    if (bag.length === 0 && dragonHp > 0) {
      finishGame("lose", "패배! 주머니의 큐브가 모두 떨어졌습니다.");
    }
  }

  function castSpell(spell) {
    if (gameStatus !== "playing") {
      return;
    }

    if (!canCastSpell(spell, keptCubes)) {
      playSfx("missing");
      triggerAnimation("missing");
      addEventLog("아직 필요한 원자 큐브가 부족합니다.", "warning");
      return;
    }

    const { remaining, used } = removeRequiredCubes(keptCubes, spell.requiredCubes);
    const nextDragonHp = Math.max(0, dragonHp - spell.damage);
    setKeptCubes(remaining);
    setDiscardedCubes((previous) => [...previous, ...used]);
    setDragonHp(nextDragonHp);
    setCastHistory((previous) => [...previous, spell.id]);
    setUsedElementHistory((previous) => [...previous, ...used]);
    playSfx("cast", spell.id);
    window.setTimeout(() => playSfx("impact", spell.id), 2140);
    triggerAnimation("cast");
    addEventLog(`주문 성공! ${spell.formula} 분자식을 완성했습니다. 드래곤에게 ${spell.damage} 피해를 입혔습니다.`, "success");

    if (nextDragonHp <= 0) {
      finishGame("win", "승리! 분자식 주문으로 드래곤을 물리쳤습니다.");
    }
  }

  const renderedScreen = (() => {
    if (screen === "start") {
      return (
        <StartScreen
          onGuide={() => {
            startMusic();
            changeScreen("guide");
          }}
        />
      );
    }

    if (screen === "guide") {
      return (
        <GuideScreen
          guideTopic={guideTopic}
          setGuideTopic={setGuideTopic}
          onBack={() => changeScreen("start")}
          onTutorial={() => changeScreen("tutorial")}
          onPlay={() => resetGame("game")}
        />
      );
    }

    if (screen === "tutorial") {
      return (
        <TutorialScreen
          step={tutorialStep}
          setStep={setTutorialStep}
          onBack={() => changeScreen("guide")}
          onPlay={() => resetGame("game")}
        />
      );
    }

    if (screen === "result") {
      return (
        <ResultScreen
          gameStatus={gameStatus}
          castHistory={castHistory}
          usedElementHistory={usedElementHistory}
          bag={bag}
          resetGame={resetGame}
          changeScreen={changeScreen}
        />
      );
    }

    return (
      <GameScreen
        bag={bag}
        keptCubes={keptCubes}
        turnCubes={turnCubes}
        discardedCubes={discardedCubes}
        dragonHp={dragonHp}
        selectedSpell={selectedSpell}
        selectedSpellId={selectedSpellId}
        setSelectedSpellId={setSelectedSpellId}
        message={message}
        eventLog={eventLog}
        animationState={animationState}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        showGameGuide={showGameGuide}
        setShowGameGuide={setShowGameGuide}
        guideTopic={guideTopic}
        setGuideTopic={setGuideTopic}
        drawCube={drawCube}
        stopDrawing={stopDrawing}
        castSpell={castSpell}
        resetGame={resetGame}
        changeScreen={changeScreen}
      />
    );
  })();

  return (
    <div
      className="chem-game"
      style={{
        "--battle-scene": `url(${battleScene})`,
        "--parchment-panel": `url(${parchmentPanel})`,
      }}
    >
      <audio
        ref={musicAudioRef}
        src={BACKGROUND_MUSIC[musicTrackIndex].src}
        preload="auto"
        onEnded={() => setMusicTrackIndex((index) => (index + 1) % BACKGROUND_MUSIC.length)}
      />
      <button className="audio-toggle" type="button" onClick={toggleMusic} aria-label="배경음악 재생 설정">
        {isMusicOn ? `음악 끄기 · ${BACKGROUND_MUSIC[musicTrackIndex].title}` : "음악 켜기"}
      </button>
      <div key={`${screen}-${screenKey}`} className="screen-shell">
        {renderedScreen}
      </div>
    </div>
  );
}
