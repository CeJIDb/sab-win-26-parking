# Брендинг репозитория — чеклист

Регламент действий, связанных с внешним видом репозитория: OG-image и Netlify-сабдомен.

## OG-image (Social Preview)

1. Подготовить PNG 1200×630, ≤ 1 МБ. Сохранить как `docs/assets/social-preview.png`.
2. GitHub → репозиторий → Settings → General → Social preview → Edit → Upload an image → выбрать локальную копию `docs/assets/social-preview.png`.
3. Проверить рендер:
   - открыть `https://github.com/CeJIDb/sab-win-26-mine-parking` в режиме инкогнито — карточка должна показываться в превью ссылки;
   - `https://metatags.io/?url=https%3A%2F%2Fgithub.com%2FCeJIDb%2Fsab-win-26-mine-parking` — проверить тег `og:image` и предпросмотр для Twitter/Facebook/LinkedIn;
   - кэш мессенджеров (Telegram, Slack, x.com) обновляется не сразу — это нормально, не считать за провал.
4. При обновлении OG-image — заменить файл в `docs/assets/`, повторить шаг 2.

## Netlify-сабдомен

**Поведение старой ссылки.** После переименования сайта в Netlify старый адрес `boisterous-heliotrope-94df12.netlify.app` перестает обслуживать ваш сайт — обращения к нему возвращают 404. Точные сроки и условия повторного выделения старого имени Netlify не гарантирует, поэтому считайте старую ссылку «мертвой» с момента переименования. Практический вывод: правьте ссылки в репо в той же сессии, в которой меняете имя в UI.

Шаги:

1. Netlify → Sites → выбрать сайт → Site configuration → Domain management → Options → Edit site name.
2. Ввести новое имя (рекомендация: `mine-parking-sab-win-26` или похожее короткое осмысленное). Сохранить.
3. Проверить, что новый адрес `https://<new-name>.netlify.app/` открывается, wireframe рендерится.
4. Обновить ссылку в репо в четырех местах:
   - `README.md` — блок бейджей, бейдж «Demo».
   - `README.md` — секция `## Навигация`, строка `Wireframe — демо`.
   - `README.md` — секция `## Wireframe-макет`, абзац «Задеплоенная версия UI доступна по ссылке».
   - `docs/process/project-journey.md` — абзац «Задеплоенная версия wireframe».
5. **Не трогать** документы-снимки, где URL фиксирует состояние на конкретную дату:
   - `docs/interviews/plans/interview-plan-7-2026-03-04-v01.md`, `docs/interviews/protocols/interview-protocol-7-2026-03-04-v01.md` — URL отражает реальность на 2026-03-04;
   - `plans/2026-05-12-readme-showcase.md` — план-снимок решений подплана 1 на 2026-05-12; URL зафиксирован в обосновании «решение зафиксировано» и менять его задним числом — искажать историю решений.
6. Прогнать `npm run lint:md-links` — должен быть зеленым.
