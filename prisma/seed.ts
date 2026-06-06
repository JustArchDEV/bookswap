import { PrismaClient, BookCondition, BookStatus, ExchangeStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Очищення бази даних...');

  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.exchange.deleteMany();
  await prisma.bookImage.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany({ where: { role: UserRole.USER } });

  console.log('✅ База очищена');

  // Жанри
  const genres = await Promise.all([
    prisma.genre.upsert({ where: { name: 'Фантастика' }, update: {}, create: { name: 'Фантастика' } }),
    prisma.genre.upsert({ where: { name: 'Детектив' }, update: {}, create: { name: 'Детектив' } }),
    prisma.genre.upsert({ where: { name: 'Роман' }, update: {}, create: { name: 'Роман' } }),
    prisma.genre.upsert({ where: { name: 'Бізнес' }, update: {}, create: { name: 'Бізнес' } }),
    prisma.genre.upsert({ where: { name: 'Психологія' }, update: {}, create: { name: 'Психологія' } }),
    prisma.genre.upsert({ where: { name: 'Історія' }, update: {}, create: { name: 'Історія' } }),
    prisma.genre.upsert({ where: { name: 'Наука' }, update: {}, create: { name: 'Наука' } }),
  ]);

  const [fantasy, detective, novel, business, psychology, history, science] = genres;

  console.log('✅ Жанри створені');

  // Паролі
  const password = await bcrypt.hash('Password123!', 12);

  // Адмін
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookswap.local' },
    update: {},
    create: {
      email: 'admin@bookswap.local',
      name: 'Адміністратор',
      password: await bcrypt.hash('Admin123!', 12),
      role: UserRole.ADMIN,
      city: 'Київ',
      bio: 'Адміністратор платформи BookSwap',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  // Користувачі
  const olena = await prisma.user.create({
    data: {
      email: 'olena@bookswap.local',
      name: 'Олена Коваленко',
      password,
      city: 'Київ',
      bio: 'Люблю читати романи та фантастику. Завжди рада обмінятись гарною книгою!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olena',
    },
  });

  const mykola = await prisma.user.create({
    data: {
      email: 'mykola@bookswap.local',
      name: 'Микола Шевченко',
      password,
      city: 'Львів',
      bio: 'Читаю все підряд — від детективів до наукової літератури.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mykola',
    },
  });

  const iryna = await prisma.user.create({
    data: {
      email: 'iryna@bookswap.local',
      name: 'Ірина Бондаренко',
      password,
      city: 'Харків',
      bio: 'Книги — моє все. Особливо люблю психологію та саморозвиток.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iryna',
    },
  });

  const dmytro = await prisma.user.create({
    data: {
      email: 'dmytro@bookswap.local',
      name: 'Дмитро Петренко',
      password,
      city: 'Одеса',
      bio: 'Бізнес-література та історія — мої головні інтереси.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmytro',
    },
  });

  const sofia = await prisma.user.create({
    data: {
      email: 'sofia@bookswap.local',
      name: 'Софія Мельник',
      password,
      city: 'Дніпро',
      bio: 'Студентка, обожнюю фантастику та детективи.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    },
  });

  console.log('✅ Користувачі створені');

  // Книги Олени
  const book1 = await prisma.book.create({
    data: {
      title: 'Майстер і Маргарита',
      author: 'Михайло Булгаков',
      description: 'Один із найвидатніших романів XX століття. Поєднує сатиру радянської дійсності з філософськими роздумами про добро і зло.',
      language: 'uk',
      publishedYear: 1967,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: olena.id,
      genreId: novel.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', publicId: 'book1', position: 0, isCover: true }] },
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Гаррі Поттер і філософський камінь',
      author: 'Джоан Роулінг',
      description: 'Перша книга знаменитої серії про юного чарівника Гаррі Поттера та його пригоди у школі чаклунства Гоґвортс.',
      language: 'uk',
      publishedYear: 2002,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: olena.id,
      genreId: fantasy.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', publicId: 'book2', position: 0, isCover: true }] },
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'Дюна',
      author: 'Френк Герберт',
      description: 'Епічний науково-фантастичний роман про далеке майбутнє, міжгалактичну політику та боротьбу за контроль над найціннішим ресурсом у всесвіті.',
      language: 'uk',
      publishedYear: 2019,
      condition: BookCondition.NEW,
      status: BookStatus.AVAILABLE,
      ownerId: olena.id,
      genreId: fantasy.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', publicId: 'book3', position: 0, isCover: true }] },
    },
  });

  // Книги Миколи
  const book4 = await prisma.book.create({
    data: {
      title: 'Шерлок Холмс. Повне зібрання',
      author: 'Артур Конан Дойл',
      description: 'Повне зібрання творів про знаменитого детектива Шерлока Холмса та його вірного друга доктора Ватсона.',
      language: 'uk',
      publishedYear: 2015,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: mykola.id,
      genreId: detective.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', publicId: 'book4', position: 0, isCover: true }] },
    },
  });

  const book5 = await prisma.book.create({
    data: {
      title: 'Короткий опис великої всесвіту',
      author: 'Стівен Гокінг',
      description: 'Захоплива розповідь про будову всесвіту, чорні діри, початок і кінець часу від одного з найвидатніших фізиків сучасності.',
      language: 'uk',
      publishedYear: 2018,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: mykola.id,
      genreId: science.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80', publicId: 'book5', position: 0, isCover: true }] },
    },
  });

  const book6 = await prisma.book.create({
    data: {
      title: 'Кобзар',
      author: 'Тарас Шевченко',
      description: 'Збірка поетичних творів великого українського поета і художника Тараса Шевченка. Символ української літератури та національної ідентичності.',
      language: 'uk',
      publishedYear: 2020,
      condition: BookCondition.NEW,
      status: BookStatus.AVAILABLE,
      ownerId: mykola.id,
      genreId: novel.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80', publicId: 'book6', position: 0, isCover: true }] },
    },
  });

  // Книги Ірини
  const book7 = await prisma.book.create({
    data: {
      title: 'Думай і багатій',
      author: 'Наполеон Хілл',
      description: 'Класика бізнес-літератури. Книга розкриває 13 принципів досягнення успіху та фінансової незалежності.',
      language: 'uk',
      publishedYear: 2016,
      condition: BookCondition.FAIR,
      status: BookStatus.AVAILABLE,
      ownerId: iryna.id,
      genreId: business.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', publicId: 'book7', position: 0, isCover: true }] },
    },
  });

  const book8 = await prisma.book.create({
    data: {
      title: 'Сила звички',
      author: 'Чарльз Дахіґґ',
      description: 'Наукове дослідження про те, чому ми робимо те, що робимо, і як можна змінити свої звички.',
      language: 'uk',
      publishedYear: 2017,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: iryna.id,
      genreId: psychology.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', publicId: 'book8', position: 0, isCover: true }] },
    },
  });

  // Книги Дмитра
  const book9 = await prisma.book.create({
    data: {
      title: 'Sapiens: Коротка історія людства',
      author: 'Юваль Ной Харарі',
      description: 'Захоплива розповідь про еволюцію людини від давніх часів до сьогодення. Бестселер, що змінює уявлення про світ.',
      language: 'uk',
      publishedYear: 2019,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: dmytro.id,
      genreId: history.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80', publicId: 'book9', position: 0, isCover: true }] },
    },
  });

  const book10 = await prisma.book.create({
    data: {
      title: 'Від нуля до одиниці',
      author: 'Пітер Тіль',
      description: 'Книга про стартапи та інновації від засновника PayPal. Як будувати компанії, що створюють нове майбутнє.',
      language: 'uk',
      publishedYear: 2020,
      condition: BookCondition.NEW,
      status: BookStatus.AVAILABLE,
      ownerId: dmytro.id,
      genreId: business.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80', publicId: 'book10', position: 0, isCover: true }] },
    },
  });

  // Книги Софії
  const book11 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'Джордж Орвелл',
      description: 'Антиутопічний роман про тоталітарне суспільство майбутнього. Одна з найвпливовіших книг XX століття.',
      language: 'uk',
      publishedYear: 2021,
      condition: BookCondition.GOOD,
      status: BookStatus.AVAILABLE,
      ownerId: sofia.id,
      genreId: fantasy.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80', publicId: 'book11', position: 0, isCover: true }] },
    },
  });

  const book12 = await prisma.book.create({
    data: {
      title: 'Злочин і кара',
      author: 'Федір Достоєвський',
      description: 'Психологічний роман про злочин, провину та спокуту. Класика світової літератури.',
      language: 'uk',
      publishedYear: 2018,
      condition: BookCondition.FAIR,
      status: BookStatus.AVAILABLE,
      ownerId: sofia.id,
      genreId: novel.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80', publicId: 'book12', position: 0, isCover: true }] },
    },
  });

  console.log('✅ Книги створені');

  // Обмін 1: Олена просить книгу Миколи, пропонує свою — COMPLETED
  const exchange1 = await prisma.exchange.create({
    data: {
      requesterId: olena.id,
      ownerId: mykola.id,
      requestedBookId: book4.id,
      offeredBookId: book1.id,
      status: ExchangeStatus.COMPLETED,
      completedAt: new Date('2026-05-15'),
      messages: {
        create: [
          { senderId: olena.id, content: 'Привіт! Мене дуже зацікавив ваш Шерлок Холмс. Пропоную обмін на Майстра і Маргариту!', isRead: true, createdAt: new Date('2026-05-10T10:00:00') },
          { senderId: mykola.id, content: 'Привіт! Звісно, чудова пропозиція! Де зручніше зустрітись?', isRead: true, createdAt: new Date('2026-05-10T10:30:00') },
          { senderId: olena.id, content: 'Я живу в Київі, може в центрі? Наприклад біля метро Хрещатик?', isRead: true, createdAt: new Date('2026-05-10T11:00:00') },
          { senderId: mykola.id, content: 'Я буду в Києві на наступному тижні. Домовимось на середу?', isRead: true, createdAt: new Date('2026-05-10T11:30:00') },
          { senderId: olena.id, content: 'Чудово! Середа о 14:00 підходить. До зустрічі!', isRead: true, createdAt: new Date('2026-05-10T12:00:00') },
          { senderId: mykola.id, content: 'Дякую за обмін! Книга чудова 😊', isRead: true, createdAt: new Date('2026-05-15T15:00:00') },
        ],
      },
    },
  });

  // Оновлюємо статуси книг
  await prisma.book.update({ where: { id: book4.id }, data: { status: BookStatus.EXCHANGED } });
  await prisma.book.update({ where: { id: book1.id }, data: { status: BookStatus.EXCHANGED } });

  // Відгук після обміну
  await prisma.review.create({
    data: {
      authorId: olena.id,
      targetId: mykola.id,
      exchangeId: exchange1.id,
      rating: 5,
      comment: 'Дуже приємна людина, все пройшло чудово! Рекомендую для обміну.',
    },
  });

  await prisma.review.create({
    data: {
      authorId: mykola.id,
      targetId: olena.id,
      exchangeId: exchange1.id,
      rating: 5,
      comment: 'Олена — надійний партнер для обміну. Книга в чудовому стані!',
    },
  });

  // Обмін 2: Дмитро просить книгу Ірини — ACCEPTED
  const exchange2 = await prisma.exchange.create({
    data: {
      requesterId: dmytro.id,
      ownerId: iryna.id,
      requestedBookId: book7.id,
      offeredBookId: book9.id,
      status: ExchangeStatus.ACCEPTED,
      messages: {
        create: [
          { senderId: dmytro.id, content: 'Добрий день! Хотів би обміняти "Думай і багатій" на мій Sapiens. Як вам така пропозиція?', isRead: true, createdAt: new Date('2026-06-01T09:00:00') },
          { senderId: iryna.id, content: 'Доброго дня! Чудова ідея, Sapiens давно хотіла прочитати. Домовились!', isRead: true, createdAt: new Date('2026-06-01T09:30:00') },
          { senderId: dmytro.id, content: 'Відмінно! Як вам зручніше передати книги?', isRead: true, createdAt: new Date('2026-06-01T10:00:00') },
          { senderId: iryna.id, content: 'Можемо Новою поштою. Надішліть мені свою адресу.', isRead: false, createdAt: new Date('2026-06-02T11:00:00') },
        ],
      },
    },
  });

  await prisma.book.update({ where: { id: book7.id }, data: { status: BookStatus.RESERVED } });
  await prisma.book.update({ where: { id: book9.id }, data: { status: BookStatus.RESERVED } });

  // Обмін 3: Софія просить книгу Олени — PENDING
  await prisma.exchange.create({
    data: {
      requesterId: sofia.id,
      ownerId: olena.id,
      requestedBookId: book2.id,
      offeredBookId: book11.id,
      status: ExchangeStatus.PENDING,
      messages: {
        create: [
          { senderId: sofia.id, content: 'Привіт! Бачу у вас є Гаррі Поттер — давно шукаю цю книгу! Пропоную свій "1984" в обмін.', isRead: false, createdAt: new Date('2026-06-05T14:00:00') },
        ],
      },
    },
  });

  // Обмін 4: Микола просить книгу Дмитра — PENDING
  await prisma.exchange.create({
    data: {
      requesterId: mykola.id,
      ownerId: dmytro.id,
      requestedBookId: book10.id,
      offeredBookId: book5.id,
      status: ExchangeStatus.PENDING,
      messages: {
        create: [
          { senderId: mykola.id, content: 'Вітаю! Зацікавила ваша книга "Від нуля до одиниці". Хочу запропонувати обмін на Стівена Гокінга.', isRead: false, createdAt: new Date('2026-06-06T10:00:00') },
        ],
      },
    },
  });

  // Обмін 5: Ірина просить книгу Софії — COMPLETED
  const exchange5 = await prisma.exchange.create({
    data: {
      requesterId: iryna.id,
      ownerId: sofia.id,
      requestedBookId: book12.id,
      offeredBookId: book8.id,
      status: ExchangeStatus.COMPLETED,
      completedAt: new Date('2026-05-20'),
      messages: {
        create: [
          { senderId: iryna.id, content: 'Доброго дня, Софіє! Хотіла б обміняти "Злочин і кару" на "Силу звички".', isRead: true, createdAt: new Date('2026-05-12T08:00:00') },
          { senderId: sofia.id, content: 'Привіт! Звісно, чудовий вибір! Коли зможемо зустрітись?', isRead: true, createdAt: new Date('2026-05-12T09:00:00') },
          { senderId: iryna.id, content: 'Я в Харкові, може в суботу?', isRead: true, createdAt: new Date('2026-05-12T10:00:00') },
          { senderId: sofia.id, content: 'На жаль я в Дніпрі. Може Новою поштою?', isRead: true, createdAt: new Date('2026-05-12T11:00:00') },
          { senderId: iryna.id, content: 'Чудова ідея! Надішліть ваш номер відділення.', isRead: true, createdAt: new Date('2026-05-12T12:00:00') },
          { senderId: sofia.id, content: 'Відділення №3, Дніпро. Дякую за обмін!', isRead: true, createdAt: new Date('2026-05-20T16:00:00') },
        ],
      },
    },
  });

  await prisma.book.update({ where: { id: book12.id }, data: { status: BookStatus.EXCHANGED } });
  await prisma.book.update({ where: { id: book8.id }, data: { status: BookStatus.EXCHANGED } });

  await prisma.review.create({
    data: {
      authorId: iryna.id,
      targetId: sofia.id,
      exchangeId: exchange5.id,
      rating: 4,
      comment: 'Все пройшло добре, книга прийшла вчасно. Дякую!',
    },
  });

  console.log('✅ Обміни та повідомлення створені');
  console.log('');
  console.log('📋 Акаунти для тестування:');
  console.log('   admin@bookswap.local / Admin123!  (адмін)');
  console.log('   olena@bookswap.local / Password123!');
  console.log('   mykola@bookswap.local / Password123!');
  console.log('   iryna@bookswap.local / Password123!');
  console.log('   dmytro@bookswap.local / Password123!');
  console.log('   sofia@bookswap.local / Password123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });