import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './App.css';
import jj from './jj.png'; // 👉 src 폴더에 jj.png를 두고 import

export default function FishingGame() {
  const [stage, setStage] = useState("opening");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [bait, setBait] = useState("지렁이");
  const [floatType, setFloatType] = useState("막대찌1");
  const [mainLine, setMainLine] = useState(1.0);
  const [subLine, setSubLine] = useState(1.0);
  const [hook, setHook] = useState(1);
  const [sink, setSink] = useState(1);

  const [casting, setCasting] = useState(false); // 투척 상태
  const [biting, setBiting] = useState(false);   // 입질 상태

  const baitOptions = ["지렁이", "떡밥", "옥수수"];
  const floatOptions = ["막대찌1", "막대찌2", "막대찌3"];
  const lineOptions = Array.from({ length: 13 }, (_, i) => (0.5 + i * 0.2).toFixed(1));
  const hookOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const sinkOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const baseTime = 6;

  // 🎯 투척 후 랜덤으로 입질 발생
  useEffect(() => {
    let timer;
    if (casting) {
      const rand = Math.random() * 4000 + 7000; // 3~7초 후 입질
      timer = setTimeout(() => {
        setBiting(true);
      }, rand);
    } else {
      setBiting(false);
    }
    return () => clearTimeout(timer);
  }, [casting]);

  // 🎯 찌의 애니메이션 y값
  const getYAnimation = () => {
    if (!casting) return -200;         // 회수시 위로 올라감
    if (biting) return [110, 90, 110]; // 입질 시 살짝 들렸다 내려감
    return [-200, 0, 110];             // 기본 투척
  };

  // 🎯 애니메이션 duration
  const getDuration = () => {
    if (biting) return 0.8; // 입질 모션
    if (casting) return baseTime / sink; // 봉돌 무게 반영
    return 0.8;
  };

  return (
    <div className="game-container">
      {stage === "opening" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-4xl font-bold"
        >
          <motion.div
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3 }}
            onAnimationComplete={() => setStage("main")}
          >
            <div style={{ padding: '20px', background: '#ffef96', borderRadius: '12px', border: '4px solid #8b4513' }}>
              충주낚시광
            </div>
          </motion.div>
        </motion.div>
      )}

      {stage === "main" && (
        <div className="map-area">
          <div className="water"></div>
          <div className="mountain"></div>
          {["A", "B", "C", "D"].map((p, i) => (
            <button
              key={p}
              className="map-btn"
              style={{ top: 100 + i * 100, left: 100 + i * 80 }}
              onClick={() => { setSelectedPoint(p); setStage("detail"); }}
            >
              포인트 {p}
            </button>
          ))}
        </div>
      )}

      {stage === "detail" && (
        <div className="detail-container">
          <div className="text-2xl font-bold mb-2">포인트 {selectedPoint}</div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              background: '#87cefa',
              border: '2px solid #444',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <motion.div
              className="absolute w-full h-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {casting && (
              <motion.img
                src={jj}
                alt="막대찌"
                initial={{ y: -200, rotate: 90, x: "-50%" }}
                animate={{
                  y: getYAnimation(),
                  rotate: biting ? 0 : [90, 0, 0],
                  x: ["-50%", "-48%", "-50%", "-52%", "-50%"],
                }}
                transition={{
                  duration: getDuration(),
                  ease: "easeInOut"
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  width: "20px",
                  height: "auto"
                }}
              />
            )}
          </div>

          <div className="select-row">
            <div>
              미끼:
              <select value={bait} onChange={e => setBait(e.target.value)} disabled={casting}>
                {baitOptions.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              찌:
              <select value={floatType} onChange={e => setFloatType(e.target.value)} disabled={casting}>
                {floatOptions.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              원줄:
              <select value={mainLine} onChange={e => setMainLine(e.target.value)} disabled={casting}>
                {lineOptions.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              목줄:
              <select value={subLine} onChange={e => setSubLine(e.target.value)} disabled={casting}>
                {lineOptions.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              바늘:
              <select value={hook} onChange={e => setHook(e.target.value)} disabled={casting}>
                {hookOptions.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              봉돌:
              <select value={sink} onChange={e => setSink(e.target.value)} disabled={casting}>
                {sinkOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {!casting ? (
            <button className="cast-btn" onClick={() => setCasting(true)}>투척하기</button>
          ) : (
            <button
              className="cast-btn"
              onClick={() => {
                if (biting) {
                  // 입질이 있으면 회수
                  setCasting(false);
                  setBiting(false);
                  alert("물고기를 잡았습니다! 🎉");
                } else {
					setCasting(false);
                }
              }}
            >
              회수하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
