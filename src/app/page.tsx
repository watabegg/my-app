"use client";

import { useState, useEffect } from 'react';

type MinuteItem = {
  title: string;
  minute: string; // "minutes:seconds"
};

// "minutes:seconds" を総秒数に変換する関数
const timeToSeconds = (time: string) => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
};

export default function Home() {
  const [data, setData] = useState<MinuteItem[]>([]);
  const [result, setResult] = useState<MinuteItem[]>([]);
  const [totalMinutes, setTotalMinutes] = useState<string>('');

  useEffect(() => {
    // 静的データを取得
    const fetchData = async () => {
      const response = await fetch('/data.json');
      const data: MinuteItem[] = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  const getRandomCombination = () => {
    const items = [...data];
    const maxSeconds = 30 * 60; // 30分を秒に変換
    let totalSeconds = 0;
    const combination: MinuteItem[] = [];

    while (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const item = items[randomIndex];
      const itemSeconds = timeToSeconds(item.minute);

      // 追加したら30分を超える場合はループを終了
      if (totalSeconds + itemSeconds <= maxSeconds) {
        combination.push(item);
        totalSeconds += itemSeconds;
        items.splice(randomIndex, 1);
      } else {
        break;
      }
    }

    setResult(combination);
    setTotalMinutes(String(Math.floor(totalSeconds / 60))+':'+String(totalSeconds % 60).padStart(2, '0'));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">モテたいズセトリ、30分以内</h1>
        <button
          onClick={getRandomCombination}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 w-full hover:bg-blue-600 transition-colors"
        >
          セトリを生成
        </button>
        <ul className="space-y-2">
          {result.map((item, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              <span className="font-semibold text-gray-700">{item.title}</span>
              <span className="ml-2 text-gray-500">({item.minute})</span>
            </li>
          ))}
        </ul>
        <span className="block text-center text-gray-500 mt-4">総時間: {totalMinutes}</span>
      </div>
    </div>
  );
}
