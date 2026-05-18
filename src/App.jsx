import { useEffect, useMemo, useRef, useState } from "react";
import battleMusic from "./assets/battle-song.mp3";
import battleScene from "./assets/alchemy-meadow-battle.png";
import cubeSummonEffect from "./assets/cube-summon-effect.png";
import dragonFireBreath from "./assets/dragon-fire-breath.png";
import heroGateMusic from "./assets/hero-gate.mp3";
import parchmentPanel from "./assets/parchment-panel.png";
import spellAmmoniaVeil from "./assets/spell-ammonia-veil.png";
import spellCarbonBurst from "./assets/spell-carbon-burst.png";
import spellCarbonMist from "./assets/spell-carbon-mist.png";
import spellLightningAqua from "./assets/spell-lightning-aqua.png";
import spellMethaneInferno from "./assets/spell-methane-inferno.png";
import spellWaterBomb from "./assets/spell-water-bomb.png";
import "./App.css";

const DRAGON_MAX_HP = 18;

const INITIAL_BAG = [
  ...Array(30).fill("H"),
  ...Array(26).fill("O"),
  ...Array(16).fill("C"),
  ...Array(10).fill("N"),
  ...Array(8).fill("Cl"),
  ...Array(9).fill("D"),
];

const SPELL_EFFECT_IMAGES = {
  "hydrogen-wisp": spellLightningAqua,
  "water-guard": spellWaterBomb,
  "oxygen-gale": spellLightningAqua,
  "peroxide-spark": spellWaterBomb,
  "nitrogen-seal": spellAmmoniaVeil,
  "ammonia-veil": spellAmmoniaVeil,
  "carbon-dioxide-fog": spellCarbonMist,
  "methane-flame": spellMethaneInferno,
  "ozone-barrier": spellLightningAqua,
  "hydrogen-chloride-sting": spellCarbonBurst,
  "carbon-monoxide-shadow": spellCarbonMist,
  "glucose-star": spellWaterBomb,
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

function makeCubes(counts) {
  return Object.entries(counts).flatMap(([cube, count]) => Array(count).fill(cube));
}

const SPELLS = [
  {
    id: "hydrogen-wisp",
    name: "수소 위스프",
    subtitle: "수소 기체 H₂",
    level: 1,
    damage: 1,
    equation: "2H → H₂",
    reactants: makeCubes({ H: 2 }),
    products: makeCubes({ H: 2 }),
    explanation:
      "수소 원자 2개가 모여 수소 기체 분자 H₂를 이룹니다. H 원자 수는 완성 전후 모두 2개입니다.",
  },
  {
    id: "water-guard",
    name: "워터 가드",
    subtitle: "물 H₂O",
    level: 1,
    damage: 2,
    equation: "2H + O → H₂O",
    reactants: makeCubes({ H: 2, O: 1 }),
    products: ["H", "O", "H"],
    explanation:
      "물 분자 H₂O는 수소 원자 2개와 산소 원자 1개로 이루어집니다. H는 2개, O는 1개로 같습니다.",
  },
  {
    id: "oxygen-gale",
    name: "산소 게일",
    subtitle: "산소 기체 O₂",
    level: 1,
    damage: 1,
    equation: "2O → O₂",
    reactants: makeCubes({ O: 2 }),
    products: makeCubes({ O: 2 }),
    explanation:
      "산소 기체 분자 O₂는 산소 원자 2개로 이루어집니다. O 원자 수는 완성 전후 모두 2개입니다.",
  },
  {
    id: "peroxide-spark",
    name: "퍼옥사이드 스파크",
    subtitle: "과산화수소 H₂O₂",
    level: 2,
    damage: 3,
    equation: "2H + 2O → H₂O₂",
    reactants: makeCubes({ H: 2, O: 2 }),
    products: ["H", "O", "O", "H"],
    explanation:
      "과산화수소 H₂O₂는 수소 2개와 산소 2개로 이루어집니다. 두 원자의 개수는 완성 전후에 같습니다.",
  },
  {
    id: "nitrogen-seal",
    name: "질소 봉인",
    subtitle: "질소 기체 N₂",
    level: 1,
    damage: 1,
    equation: "2N → N₂",
    reactants: makeCubes({ N: 2 }),
    products: makeCubes({ N: 2 }),
    explanation:
      "질소 기체 분자 N₂는 질소 원자 2개로 이루어집니다. N 원자 수는 완성 전후 모두 2개입니다.",
  },
  {
    id: "ammonia-veil",
    name: "암모니아 베일",
    subtitle: "암모니아 NH₃",
    level: 2,
    damage: 3,
    equation: "N + 3H → NH₃",
    reactants: makeCubes({ N: 1, H: 3 }),
    products: ["N", "H", "H", "H"],
    explanation:
      "암모니아 NH₃는 질소 원자 1개와 수소 원자 3개로 이루어집니다. N은 1개, H는 3개로 같습니다.",
  },
  {
    id: "carbon-dioxide-fog",
    name: "이산화탄소 안개",
    subtitle: "이산화탄소 CO₂",
    level: 2,
    damage: 3,
    equation: "C + 2O → CO₂",
    reactants: makeCubes({ C: 1, O: 2 }),
    products: ["O", "C", "O"],
    explanation:
      "이산화탄소 CO₂는 탄소 원자 1개와 산소 원자 2개로 이루어집니다. C는 1개, O는 2개로 같습니다.",
  },
  {
    id: "methane-flame",
    name: "메테인 플레임",
    subtitle: "메테인 CH₄",
    level: 2,
    damage: 4,
    equation: "C + 4H → CH₄",
    reactants: makeCubes({ C: 1, H: 4 }),
    products: ["H", "H", "C", "H", "H"],
    explanation:
      "메테인 CH₄는 탄소 원자 1개와 수소 원자 4개로 이루어집니다. C는 1개, H는 4개로 같습니다.",
  },
  {
    id: "ozone-barrier",
    name: "오존 배리어",
    subtitle: "오존 O₃",
    level: 2,
    damage: 3,
    equation: "3O → O₃",
    reactants: makeCubes({ O: 3 }),
    products: makeCubes({ O: 3 }),
    explanation:
      "오존 O₃는 산소 원자 3개가 모인 분자입니다. O 원자 수는 완성 전후 모두 3개입니다.",
  },
  {
    id: "hydrogen-chloride-sting",
    name: "염화수소 가시",
    subtitle: "염화수소 HCl",
    level: 2,
    damage: 3,
    equation: "H + Cl → HCl",
    reactants: makeCubes({ H: 1, Cl: 1 }),
    products: ["H", "Cl"],
    explanation:
      "염화수소 HCl은 수소 원자 1개와 염소 원자 1개로 이루어집니다. H와 Cl은 각각 1개입니다.",
  },
  {
    id: "carbon-monoxide-shadow",
    name: "일산화탄소 그림자",
    subtitle: "일산화탄소 CO",
    level: 2,
    damage: 2,
    equation: "C + O → CO",
    reactants: makeCubes({ C: 1, O: 1 }),
    products: ["C", "O"],
    explanation:
      "일산화탄소 CO는 탄소 원자 1개와 산소 원자 1개로 이루어집니다. C와 O는 각각 1개입니다.",
  },
  {
    id: "glucose-star",
    name: "포도당 별빛",
    subtitle: "포도당 C₆H₁₂O₆",
    level: 4,
    damage: 5,
    equation: "6C + 12H + 6O → C₆H₁₂O₆",
    reactants: makeCubes({ C: 6, H: 12, O: 6 }),
    products: ["C", "H", "O", "H", "C", "H", "O", "H", "C", "H", "O", "H", "C", "H", "O", "H", "C", "H", "O", "H", "C", "H", "O", "H"],
    explanation:
      "포도당 C₆H₁₂O₆는 탄소 6개, 수소 12개, 산소 6개로 이루어진 큰 분자입니다. 모든 원자 수가 완성 전후에 같습니다.",
  },
];

const GUIDE_SECTIONS = [
  {
    title: "게임 목표",
    body: "화학 마법사가 되어 원소 큐브를 모으고 분자식 주문을 완성합니다. 주문이 성공하면 드래곤 체력이 줄어듭니다.",
  },
  {
    title: "원소 큐브란?",
    body: "수소 H, 산소 O, 탄소 C, 질소 N, 염소 Cl 큐브는 분자를 이루는 원자를 뜻합니다. 드래곤 큐브는 위험 큐브입니다.",
  },
  {
    title: "차례 진행 방법",
    body: "자기 차례에는 큐브를 계속 뽑거나 멈출 수 있습니다. 멈추면 마지막 큐브 1개는 버리고 나머지를 보관합니다.",
  },
  {
    title: "드래곤 큐브의 위험",
    body: "드래곤 큐브가 나오면 이번 차례에 뽑은 원소 큐브를 모두 잃습니다. 많이 뽑을수록 보상과 위험이 함께 커집니다.",
  },
  {
    title: "주문 카드와 분자식",
    body: "주문 카드는 H₂, H₂O, NH₃, CO₂ 같은 분자식을 보여줍니다. 보관 큐브가 분자식에 필요한 원자 조건을 만족하면 주문을 시전할 수 있습니다.",
  },
  {
    title: "반응 전후 원자 수 비교",
    body: "원소 큐브가 분자식 모양으로 배열되어도 원자의 종류와 개수는 변하지 않습니다. 표에서 완성 전후를 비교하세요.",
  },
  {
    title: "승리와 패배 조건",
    body: "드래곤 체력을 0으로 만들면 승리합니다. 드래곤을 물리치기 전에 주머니 큐브가 모두 떨어지면 패배합니다.",
  },
];

const GAME_GUIDE_SECTIONS = [
  { title: "게임 목표", body: "원소 큐브를 모아 분자식 주문을 완성하고 드래곤 체력을 0으로 만드세요." },
  { title: "큐브 설명", body: "H는 수소, O는 산소, C는 탄소, N은 질소, Cl은 염소입니다. D는 이번 차례 큐브를 잃게 하는 드래곤 큐브입니다." },
  { title: "차례 진행 방법", body: "큐브를 뽑다가 멈추면 마지막 큐브 1개를 버리고 나머지를 보관합니다." },
  { title: "드래곤 큐브 규칙", body: "D가 나오면 D와 이번 차례 원소 큐브가 모두 버린 큐브로 이동합니다." },
  { title: "주문 카드 사용 방법", body: "보관 큐브가 주문 카드의 분자식 조건을 만족하면 주문 시전 버튼이 활성화됩니다." },
  { title: "분자식 학습 포인트", body: "분자식의 아래 작은 숫자는 그 원자가 몇 개 들어 있는지 보여줍니다. 완성 전후 원자 종류와 개수는 같습니다." },
  { title: "승리와 패배", body: "주문 피해로 드래곤 체력을 0으로 만들면 승리, 주머니가 먼저 비면 패배입니다." },
];

const TUTORIAL_STEPS = [
  {
    title: "1. 게임 목표",
    text: "당신은 화학 마법사입니다. 원소 큐브를 모아 분자식 주문을 완성하고 드래곤의 체력을 0으로 만드세요.",
    highlight: "goal",
  },
  {
    title: "2. 원소 큐브",
    text: "H는 수소, O는 산소, C는 탄소, N은 질소, Cl은 염소입니다. 큐브는 분자를 이루는 원자를 나타냅니다.",
    highlight: "cubes",
  },
  {
    title: "3. 큐브 뽑기",
    text: "자기 차례에는 큐브를 원하는 만큼 뽑을 수 있습니다. 많이 뽑으면 주문을 완성하기 쉬워집니다.",
    highlight: "draw",
  },
  {
    title: "4. 멈추기",
    text: "뽑기를 멈추면 마지막으로 뽑은 원소 큐브 1개는 버리고, 나머지 큐브는 보관합니다.",
    highlight: "stop",
  },
  {
    title: "5. 드래곤 큐브",
    text: "드래곤 큐브를 뽑으면 이번 차례에 뽑은 원소 큐브를 모두 잃습니다. 계속 뽑을지 멈출지 판단하세요.",
    highlight: "dragon",
  },
  {
    title: "6. 주문 시전",
    text: "보관한 원소 큐브가 주문 카드의 분자식 조건을 만족하면 주문을 시전할 수 있습니다.",
    highlight: "spell",
  },
  {
    title: "7. 분자식 이해",
    text: "주문을 시전하면 원소 큐브가 분자식 모양으로 배열됩니다. 이때 원자의 종류와 개수는 완성 전후에 같습니다.",
    highlight: "analysis",
  },
  {
    title: "8. 승리 조건",
    text: "주문을 성공시켜 드래곤 체력을 0으로 만들면 승리합니다. 주머니가 먼저 비면 패배합니다.",
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

export function countElements(cubes) {
  return cubes.reduce(
    (counts, cube) => ({
      ...counts,
      [cube]: (counts[cube] ?? 0) + 1,
    }),
    {},
  );
}

export function canCastSpell(spell, keptCubes) {
  const keptCounts = countElements(keptCubes);
  const requiredCounts = countElements(spell.reactants);

  return Object.entries(requiredCounts).every(([cube, required]) => (keptCounts[cube] ?? 0) >= required);
}

export function getAtomComparison(spell) {
  const before = countElements(spell.reactants);
  const after = countElements(spell.products);
  const atoms = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).sort();

  return atoms.map((atom) => ({
    atom,
    before: before[atom] ?? 0,
    after: after[atom] ?? 0,
    matches: (before[atom] ?? 0) === (after[atom] ?? 0),
  }));
}

function getMissingReactants(spell, keptCubes) {
  const keptCounts = countElements(keptCubes);
  const requiredCounts = countElements(spell.reactants);

  return Object.entries(requiredCounts)
    .map(([cube, required]) => ({
      cube,
      missing: Math.max(required - (keptCounts[cube] ?? 0), 0),
    }))
    .filter((item) => item.missing > 0);
}

function removeRequiredCubes(keptCubes, requiredCubes) {
  const remaining = [...keptCubes];

  requiredCubes.forEach((cube) => {
    const targetIndex = remaining.indexOf(cube);
    if (targetIndex >= 0) {
      remaining.splice(targetIndex, 1);
    }
  });

  return remaining;
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

function BattleScene({ dragonHp, animationState, showTitle = false, attackCubes = [], attackEffectSrc = spellWaterBomb }) {
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
        <p className="teacher-note">중학교 과학 · 화학 반응식 학습 게임</p>
        <h1>케미술사: 드래곤의 반응식</h1>
        <p>원소 큐브를 모아 화학 반응식 주문을 완성하고 드래곤을 물리치세요.</p>
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
          <p className="science-note">반응식은 원자가 새로 생기거나 사라지지 않고 다시 배열되는 과정을 보여줍니다.</p>
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
            <strong>2H + O → H₂O</strong>
            <small>원자 수 비교</small>
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
        <span>난이도 {spell.level}</span>
      </span>
      <small>{spell.subtitle}</small>
      <em>{spell.equation}</em>
      <span className="mini-cubes">
        {spell.reactants.map((cube, index) => (
          <ElementCube key={`${spell.id}-${cube}-${index}`} type={cube} small muted={!castable} />
        ))}
      </span>
      <span className="spell-card-explanation">{spell.explanation}</span>
      {missing.length > 0 ? (
        <span className="missing-line">
          부족{" "}
          {missing.map((item) => `${ELEMENTS[item.cube].short} ${item.missing}개`).join(", ")}
        </span>
      ) : (
        <span className="ready-line">시전 가능</span>
      )}
    </button>
  );
}

function AtomComparisonTable({ comparison }) {
  const allMatch = comparison.every((row) => row.matches);

  return (
    <div className="atom-panel">
      <h3>원자 보존 비교</h3>
      <table>
        <thead>
          <tr>
            <th>원소</th>
            <th>반응 전</th>
            <th>반응 후</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row) => (
            <tr key={row.atom} className={row.matches ? "is-matching" : ""}>
              <td>{row.atom}</td>
              <td>{row.before}</td>
              <td>{row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allMatch ? <p className="match-message">원자의 종류와 개수가 반응 전후에 같습니다.</p> : null}
    </div>
  );
}

function ReactionAnalysis({ spell, missing, castable, comparison, onCast, animationState, mobileActive }) {
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
      <div className="equation-banner">{spell.equation}</div>
      <p className="spell-explanation">{spell.explanation}</p>
      {missing.length > 0 ? (
        <p className="warning-text">아직 필요한 원소 큐브가 부족합니다.</p>
      ) : (
        <p className="success-text">반응물 큐브가 준비되었습니다.</p>
      )}
      <div className="reaction-arrangement">
        <div>
          <strong>반응 전 원자 수</strong>
          <CubeGroup cubes={spell.reactants} compact emptyText="반응물이 없습니다." />
        </div>
        <span className="reaction-arrow">→</span>
        <div>
          <strong>반응 후 원자 수</strong>
          <CubeGroup cubes={spell.products} compact emptyText="생성물이 없습니다." />
        </div>
      </div>
      <AtomComparisonTable comparison={comparison} />
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
  const keptCounts = useMemo(() => countElements(keptCubes), [keptCubes]);
  const discardedCounts = useMemo(() => countElements(discardedCubes), [discardedCubes]);
  const selectedMissing = useMemo(() => getMissingReactants(selectedSpell, keptCubes), [keptCubes, selectedSpell]);
  const selectedCanCast = selectedMissing.length === 0;
  const comparison = useMemo(() => getAtomComparison(selectedSpell), [selectedSpell]);

  return (
    <section className={`screen game-screen ${animationState ? `is-${animationState}` : ""}`}>
      <header className="game-header">
        <div>
          <p className="teacher-note">중학교 과학 · 원자 보존 전투</p>
          <h1>케미술사: 드래곤의 반응식</h1>
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
        attackCubes={selectedSpell.reactants}
        attackEffectSrc={SPELL_EFFECT_IMAGES[selectedSpell.id] ?? spellWaterBomb}
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
              <h2>원소 주머니</h2>
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
              <span>주문 재료</span>
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
              const missing = getMissingReactants(spell, keptCubes);
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
          comparison={comparison}
          onCast={castSpell}
          animationState={animationState}
          mobileActive={mobileTab === "analysis"}
        />
        <section className="game-panel feedback-panel" data-mobile-active={mobileTab === "log"}>
          <div className="panel-heading">
            <div>
              <span>사건 기록</span>
              <h2>마법 반응 기록</h2>
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
  const usedCounts = countElements(usedElementHistory);
  const mostUsed = Object.entries(usedCounts).sort((a, b) => b[1] - a[1])[0];
  const mostUsedText = mostUsed ? `${ELEMENTS[mostUsed[0]].label} · ${mostUsed[1]}개` : "아직 사용한 큐브가 없습니다.";

  return (
    <section className={`screen result-screen ${won ? "is-win" : "is-lose"}`}>
      <BattleScene dragonHp={won ? 0 : DRAGON_MAX_HP} animationState={won ? "win" : "lose"} showTitle />
      <article className="parchment-card result-card">
        <p className="teacher-note">{won ? "반응식 주문 성공" : "전략 다시 세우기"}</p>
        <h1>{won ? "승리! 화학 반응식 주문으로 드래곤을 물리쳤습니다." : "패배! 주머니의 큐브가 모두 떨어졌습니다."}</h1>
        {won ? (
          <p>반응물과 생성물의 원자 수를 비교하며 균형 잡힌 반응식을 완성했습니다.</p>
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
            <span>가장 많이 사용한 원소 큐브</span>
            <strong>{mostUsedText}</strong>
          </div>
        </div>
        <p className="science-note">화학 반응에서는 원자가 새로 생기거나 사라지지 않고, 반응 전후 원자의 종류와 개수가 같습니다.</p>
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
  const [selectedSpellId, setSelectedSpellId] = useState("hydrogen-wisp");
  const [message, setMessage] = useState("원소 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.");
  const [gameStatus, setGameStatus] = useState("playing");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showGameGuide, setShowGameGuide] = useState(false);
  const [eventLog, setEventLog] = useState([
    {
      id: "start-message",
      text: "원소 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.",
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

  function playSfx(type) {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
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
      playTone(context, 440, now, 0.12, "triangle", 0.05);
      playTone(context, 660, now + 0.08, 0.12, "triangle", 0.05);
      playTone(context, 990, now + 0.16, 0.18, "sine", 0.055);
      playNoise(context, now + 0.16, 0.32, 0.055, 1600);
      return;
    }

    if (type === "impact") {
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
    const startMessage = "원소 큐브를 뽑아 주문의 재료를 모으세요. 멈추면 마지막 큐브 1개는 버립니다.";
    setBag(shuffle(INITIAL_BAG));
    setTurnCubes([]);
    setKeptCubes([]);
    setDiscardedCubes([]);
    setDragonHp(DRAGON_MAX_HP);
    setSelectedSpellId("hydrogen-wisp");
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
      addEventLog("드래곤 큐브를 뽑았습니다! 이번 차례에 뽑은 원소 큐브를 모두 잃었습니다.", "danger");

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
      addEventLog("아직 필요한 원소 큐브가 부족합니다.", "warning");
      return;
    }

    const nextKeptCubes = removeRequiredCubes(keptCubes, spell.reactants);
    const nextDragonHp = Math.max(0, dragonHp - spell.damage);
    setKeptCubes(nextKeptCubes);
    setDiscardedCubes((previous) => [...previous, ...spell.reactants]);
    setDragonHp(nextDragonHp);
    setCastHistory((previous) => [...previous, spell.id]);
    setUsedElementHistory((previous) => [...previous, ...spell.reactants]);
    playSfx("cast");
    window.setTimeout(() => playSfx("impact"), 2140);
    triggerAnimation("cast");
    addEventLog(`주문 성공! ${spell.equation} 분자식 주문이 완성되었습니다. 드래곤에게 ${spell.damage} 피해를 입혔습니다.`, "success");

    if (nextDragonHp <= 0) {
      finishGame("win", "승리! 화학 반응식 주문으로 드래곤을 물리쳤습니다.");
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
