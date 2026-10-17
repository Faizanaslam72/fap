export interface WarriorQuote {
  id: number;
  text: string;
  author: string;
  category?: 'Self-Mastery' | 'Resisting Urges' | 'Pain vs Regret' | 'Iron Mind' | 'Focus & Destiny';
}

export const WARRIOR_CODE_QUOTES: WarriorQuote[] = [
  { id: 1, text: "The man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha", category: "Self-Mastery" },
  { id: 2, text: "No man is free who is not master of himself.", author: "Epictetus", category: "Self-Mastery" },
  { id: 3, text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn", category: "Pain vs Regret" },
  { id: 4, text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", category: "Iron Mind" },
  { id: 5, text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.", author: "Miyamoto Musashi", category: "Self-Mastery" },
  { id: 6, text: "Discipline equals freedom.", author: "Jocko Willink", category: "Iron Mind" },
  { id: 7, text: "He who controls others may be powerful, but he who has mastered himself is mightier still.", author: "Lao Tzu", category: "Self-Mastery" },
  { id: 8, text: "The first and best victory is to conquer self.", author: "Plato", category: "Self-Mastery" },
  { id: 9, text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", category: "Iron Mind" },
  { id: 10, text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee", category: "Iron Mind" },
  { id: 11, text: "I count him braver who overcomes his desires than him who conquers his enemies, for the hardest victory is over self.", author: "Aristotle", category: "Resisting Urges" },
  { id: 12, text: "When you want to surrender, remember why you held on for so long.", author: "Warrior Proverb", category: "Resisting Urges" },
  { id: 13, text: "A moment of patience in a moment of temptation saves a thousand moments of regret.", author: "Ali ibn Abi Talib", category: "Pain vs Regret" },
  { id: 14, text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton", category: "Iron Mind" },
  { id: 15, text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins", category: "Focus & Destiny" },
  { id: 16, text: "Rule your mind or it will rule you.", author: "Horace", category: "Self-Mastery" },
  { id: 17, text: "It is a rough road that leads to the heights of greatness.", author: "Seneca", category: "Focus & Destiny" },
  { id: 18, text: "Self-control is strength. Right thought is mastery. Calmness is power.", author: "James Allen", category: "Iron Mind" },
  { id: 19, text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", category: "Focus & Destiny" },
  { id: 20, text: "Do not let the animal inside you slaughter the king you were destined to become.", author: "Spartan Maxim", category: "Resisting Urges" },
  { id: 21, text: "The soul that has conceived one great thought can never again be satisfied with cheap dopamine.", author: "Stoic Philosophy", category: "Resisting Urges" },
  { id: 22, text: "If you conquer your mind, you conquer the entire world.", author: "Guru Nanak", category: "Self-Mastery" },
  { id: 23, text: "Curb your desires, bridle your lust, and bring your lower self under your heel.", author: "Rumi", category: "Resisting Urges" },
  { id: 24, text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell", category: "Iron Mind" },
  { id: 25, text: "A warrior does not act out of momentary whim; a warrior acts with supreme purpose.", author: "Bushido Code", category: "Focus & Destiny" },
  { id: 26, text: "The body will do whatever the mind tells it to do. Strengthen your mind.", author: "David Goggins", category: "Iron Mind" },
  { id: 27, text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus", category: "Focus & Destiny" },
  { id: 28, text: "To master others is strength; to master oneself is true power.", author: "Daodejing", category: "Self-Mastery" },
  { id: 29, text: "Difficulty shows what men are.", author: "Epictetus", category: "Pain vs Regret" },
  { id: 30, text: "Between stimulus and response there is a space. In that space is our power to choose our growth and freedom.", author: "Viktor Frankl", category: "Resisting Urges" },
  { id: 31, text: "Your urges are only tests of your authority over your own flesh.", author: "Warrior Creed", category: "Resisting Urges" },
  { id: 32, text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson", category: "Pain vs Regret" },
  { id: 33, text: "Conquer yourself and the world lies at your feet.", author: "St. Augustine", category: "Self-Mastery" },
  { id: 34, text: "What we do in life echoes in eternity.", author: "Marcus Aurelius", category: "Focus & Destiny" },
  { id: 35, text: "Iron rusts from disuse; stagnant water loses its purity; even so does inaction sap the vigors of the mind.", author: "Leonardo da Vinci", category: "Iron Mind" },
  { id: 36, text: "True nobility is being superior to your former self.", author: "Ernest Hemingway", category: "Self-Mastery" },
  { id: 37, text: "The price of excellence is discipline. The cost of mediocrity is disappointment.", author: "William Arthur Ward", category: "Pain vs Regret" },
  { id: 38, text: "Only the disciplined ones in life are truly free. If you are undisciplined, you are a slave to your moods and passions.", author: "Eliud Kipchoge", category: "Self-Mastery" },
  { id: 39, text: "A man who cannot command himself will always be commanded by another.", author: "Friedrich Nietzsche", category: "Self-Mastery" },
  { id: 40, text: "Temptation only has power over you if you negotiate with it. Refuse the conversation.", author: "Stoic Maxim", category: "Resisting Urges" },
  { id: 41, text: "Greatness is not a sudden spark; it is a thousand small sacrifices made in secret.", author: "Marcus Aurelius", category: "Iron Mind" },
  { id: 42, text: "Your ancestors survived wars and famine. Do not dishonor their bloodline by surrendering to pixels on a glass screen.", author: "Modern Warrior", category: "Resisting Urges" },
  { id: 43, text: "The urge is a storm. You are the mountain. Let it blow itself out.", author: "Zen Wisdom", category: "Resisting Urges" },
  { id: 44, text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", category: "Pain vs Regret" },
  { id: 45, text: "He who conquers his desires conuers his enemies.", author: "Alexander the Great", category: "Self-Mastery" },
  { id: 46, text: "Every time you resist a craving, you starve the beast and feed the king.", author: "Discipline Code", category: "Resisting Urges" },
  { id: 47, text: "A dog begs for treats; a king feasts at his designated hour. Act like royalty, not a slave to appetite.", author: "Classical Stoic", category: "Self-Mastery" },
  { id: 48, text: "Never let a five-second rush rob you of five months of hard-won self-respect.", author: "Warrior Code", category: "Pain vs Regret" },
  { id: 49, text: "The mind must be fortified with philosophy, the body with relentless movement.", author: "Seneca", category: "Iron Mind" },
  { id: 50, text: "You did not wake up today to be weak.", author: "Jocko Willink", category: "Iron Mind" },
  { id: 51, text: "The strongest man in the world is he who stands most alone.", author: "Henrik Ibsen", category: "Iron Mind" },
  { id: 52, text: "Pain is temporary. It may last for a minute, or an hour, or a day, or even a year. But eventually it will subside. Giving up lasts forever.", author: "Eric Thomas", category: "Pain vs Regret" },
  { id: 53, text: "He who reigns within himself and rules his passions, desires, and fears is more than a king.", author: "John Milton", category: "Self-Mastery" },
  { id: 54, text: "Self-respect is the fruit of discipline; the sense of dignity grows with the ability to say no to oneself.", author: "Abraham Joshua Heschel", category: "Self-Mastery" },
  { id: 55, text: "Do not dilute your divine fire with worthless momentary pleasures.", author: "Marcus Aurelius", category: "Resisting Urges" },
  { id: 56, text: "The only limit to our realization of tomorrow will be our doubts and temptations of today.", author: "Franklin D. Roosevelt", category: "Focus & Destiny" },
  { id: 57, text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", category: "Iron Mind" },
  { id: 58, text: "Control your breath, control your impulse, control your destiny.", author: "Samurai Code", category: "Resisting Urges" },
  { id: 59, text: "The warrior knows that dopamine earned through labor builds monuments; dopamine stolen through vice builds cages.", author: "Warrior Code", category: "Resisting Urges" },
  { id: 60, text: "Victory belongs to the most persevering.", author: "Napoleon Bonaparte", category: "Focus & Destiny" },
  { id: 61, text: "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look.", author: "Marcus Aurelius", category: "Iron Mind" },
  { id: 62, text: "To be calm when the urge screams is the highest form of warfare.", author: "Stoic Principle", category: "Resisting Urges" },
  { id: 63, text: "Suffering is the sole origin of consciousness. Embrace the discomfort.", author: "Fyodor Dostoevsky", category: "Pain vs Regret" },
  { id: 64, text: "Every battle is won before it's ever fought.", author: "Sun Tzu", category: "Iron Mind" },
  { id: 65, text: "If you want to shine like the sun, first burn like the sun.", author: "A. P. J. Abdul Kalam", category: "Focus & Destiny" },
  { id: 66, text: "Man cannot remake himself without suffering, for he is both the marble and the sculptor.", author: "Alexis Carrel", category: "Pain vs Regret" },
  { id: 67, text: "Nothing is more noble, nothing more venerable than fidelity to one's own highest standard.", author: "Cicero", category: "Self-Mastery" },
  { id: 68, text: "Stand firm like an anvil when it is beaten upon.", author: "Ignatius of Antioch", category: "Iron Mind" },
  { id: 69, text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius", category: "Self-Mastery" },
  { id: 70, text: "Do not surrender your crown for a drop of poisonous honey.", author: "Ancient Wisdom", category: "Resisting Urges" },
  { id: 71, text: "The greatest weapon against stress and temptation is our ability to choose one thought over another.", author: "William James", category: "Iron Mind" },
  { id: 72, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Focus & Destiny" },
  { id: 73, text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger", category: "Iron Mind" },
  { id: 74, text: "When you control your lower desires, your higher intelligence awakes.", author: "Pythagoras", category: "Self-Mastery" },
  { id: 75, text: "A disciplined mind brings happiness.", author: "Dhammapada", category: "Self-Mastery" },
  { id: 76, text: "If you are going through hell, keep going.", author: "Winston Churchill", category: "Iron Mind" },
  { id: 77, text: "A warrior takes responsibility for his acts, even for the most trivial of acts.", author: "Carlos Castaneda", category: "Self-Mastery" },
  { id: 78, text: "Don't count the days; make the days count.", author: "Muhammad Ali", category: "Focus & Destiny" },
  { id: 79, text: "Freedom is not granted; it is won by the mastery of your basest impulses.", author: "Warrior Creed", category: "Self-Mastery" },
  { id: 80, text: "Guard your bedroom door at night as fiercely as a fortress gate in wartime.", author: "Discipline Protocol", category: "Resisting Urges" },
  { id: 81, text: "Never trade what you want forever for what you want for five minutes.", author: "Warrior Maxim", category: "Pain vs Regret" },
  { id: 82, text: "The spirit is willing, but the flesh is weak. Train the flesh to obey.", author: "Ancient Proverb", category: "Iron Mind" },
  { id: 83, text: "The hero and the coward feel the same thing. The hero uses fear and impulse to fuel his focus.", author: "Cus D'Amato", category: "Iron Mind" },
  { id: 84, text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", category: "Focus & Destiny" },
  { id: 85, text: "Your brain will seek the path of least resistance. You must force it up the mountain.", author: "David Goggins", category: "Iron Mind" },
  { id: 86, text: "No impulse lasts forever. Breathe through the flame, and on the other side is victory.", author: "Stoic Warrior", category: "Resisting Urges" },
  { id: 87, text: "The wolf that wins is the one you feed. Starve the urges.", author: "Cherokee Proverb", category: "Resisting Urges" },
  { id: 88, text: "Hold the line. When everything in you begs to surrender, hold for ten more minutes.", author: "Spartan Law", category: "Resisting Urges" },
  { id: 89, text: "Self-command is not only itself a great virtue, but from it all the other virtues seem to derive their lustre.", author: "Adam Smith", category: "Self-Mastery" },
  { id: 90, text: "Purity of mind produces clarity of purpose and unstoppable momentum in life.", author: "Warrior Code", category: "Focus & Destiny" },
  { id: 91, text: "Character is what you do in the dark when nobody is watching.", author: "Dwight L. Moody", category: "Self-Mastery" },
  { id: 92, text: "To win any battle you must fight as if you are already dead.", author: "Hagakure (Book of the Samurai)", category: "Iron Mind" },
  { id: 93, text: "Dopamine resets when you walk through the fire of temptation without flinching.", author: "Neuroscience Creed", category: "Resisting Urges" },
  { id: 94, text: "The man who has conquered himself has conquered an army.", author: "Ancient Maxim", category: "Self-Mastery" },
  { id: 95, text: "Out of suffering have emerged the strongest souls; the massive characters are seared with scars.", author: "Kahlil Gibran", category: "Pain vs Regret" },
  { id: 96, text: "Let men see, let them know, a real man, who lives according to nature and self-rule.", author: "Marcus Aurelius", category: "Self-Mastery" },
  { id: 97, text: "You are not a slave to biological reflexes. You are an awakened consciousness with iron will.", author: "Warrior Axiom", category: "Iron Mind" },
  { id: 98, text: "A champion is someone who gets up when he can't.", author: "Jack Dempsey", category: "Iron Mind" },
  { id: 99, text: "The summit of discipline is when temptation turns into disgust and self-control into effortless power.", author: "Warrior Philosophy", category: "Self-Mastery" },
  { id: 100, text: "Stand tall. Breathe deep. You are the master of this body and the king of this mind.", author: "The Warrior Code", category: "Self-Mastery" },
];

/**
 * Gets a random quote from the 100 Warrior Code quotes
 */
export function getRandomWarriorQuote(): WarriorQuote {
  const index = Math.floor(Math.random() * WARRIOR_CODE_QUOTES.length);
  return WARRIOR_CODE_QUOTES[index];
}

/**
 * Gets the quote for a specific day or index
 */
export function getWarriorQuoteByDay(dayNumber: number): WarriorQuote {
  const index = Math.max(0, (dayNumber - 1) % WARRIOR_CODE_QUOTES.length);
  return WARRIOR_CODE_QUOTES[index];
}
