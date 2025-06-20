export const initialSetupSheets = [
  {
    id: 'session-20240715-fuji-01',
    vehicle: 'RS3 LMS TCR',
    trackName: '富士スピードウェイ',
    dateTime: '2024-07-15T13:00',
    driver: '山田 太郎',
    sessionType: '練習走行1',
    environment: { weather: '晴れ', airTemp: 28, trackTemp: 45, humidity: 65, pressure: 1012 },
    setupBefore: {
      tires: { brand: 'Bridgestone', compound: 'ソフト', mileage: 50, pressure: { fl: 195, fr: 195, rl: 190, rr: 190 } },
      engine: { oilBrand: 'Mobil 1', oilViscosity: '0W-40', oilMileage: 150 },
      fuel: 100,
      suspension: {
          rideHeight: { front: 55, rear: 60 },
          dampers: { fl: { bump: 8, rebound: 10 }, fr: { bump: 8, rebound: 10 }, rl: { bump: 6, rebound: 8 }, rr: { bump: 6, rebound: 8 } }
      }
    },
    setupAfter: { tires: { pressure: { fl: 225, fr: 228, rl: 220, rr: 222 } } },
    driverNotes: {
        freeText: '3コーナーの出口でアンダーステアが強い。次回はフロントの減衰を2クリック締めることを検討。',
        cornerBalance: {
            lowSpeed: { entry: 'neutral', mid: 'under', exit: 'neutral' },
            midSpeed: { entry: 'neutral', mid: 'neutral', exit: 'over' },
            highSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' }
        }
    },
  },
  {
    id: 'session-20240716-suzuka-01',
    vehicle: 'Roadster',
    trackName: '鈴鹿サーキット',
    dateTime: '2024-07-16T10:30',
    driver: '鈴木 一郎',
    sessionType: '予選',
    environment: { weather: '曇り', airTemp: 24, trackTemp: 33, humidity: 75, pressure: 1008 },
    setupBefore: {
      tires: { brand: 'Michelin', compound: 'スーパーソフト', mileage: 10, pressure: { fl: 190, fr: 190, rl: 185, rr: 185 } },
      engine: { oilBrand: 'Castrol', oilViscosity: '5W-50', oilMileage: 50 },
      fuel: 30,
    },
    setupAfter: { tires: { pressure: { fl: 215, fr: 218, rl: 210, rr: 213 } } },
    driverNotes: {
        freeText: 'アタックラップは完璧に決まった。マシンのバランスは非常に良い。',
        cornerBalance: {
            lowSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
            midSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' },
            highSpeed: { entry: 'neutral', mid: 'neutral', exit: 'neutral' }
        }
    },
  },
];