import type { LumenSchedulingContent } from '@lumen/app-ui';

export type SchedulingFixtureLocale = 'zh' | 'en';

export function createSchedulingFixtures(locale: SchedulingFixtureLocale): LumenSchedulingContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 42 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 120 } as const;
  const monthDays = Array.from({ length: 35 }, (_, index) => {
    const date = index - 1;
    const inMonth = date >= 1 && date <= 30;
    let label = String(date);
    if (!inMonth) {
      label = date < 1 ? String(31 + date) : String(date - 30);
    }
    return {
      id: `day-${index + 1}`,
      label,
      dateLabel: inMonth
        ? t(`2026 年 9 月 ${date} 日`, `September ${date}, 2026`)
        : date < 1
          ? t(`2026 年 8 月 ${label} 日`, `August ${label}, 2026`)
          : t(`2026 年 10 月 ${label} 日`, `October ${label}, 2026`),
      disabled: !inMonth,
      hasEvents: [8, 13, 18, 22, 27].includes(date),
    };
  });

  return {
    month: {
      labels: {
        title: t('团队日历', 'Team calendar'),
        detail: t('查看发布、评审和客户会议。', 'Review releases, reviews, and customer meetings.'),
        previousMonth: t('上个月', 'Previous month'),
        nextMonth: t('下个月', 'Next month'),
        filter: t('筛选日历', 'Filter calendar'),
        agenda: (date) => t(`${date} 的日程`, `Agenda for ${date}`),
        empty: t('当天没有日程', 'No events for this day'),
      },
      monthLabel: t('2026 年 9 月', 'September 2026'),
      days: monthDays,
      initialDayId: 'day-17',
      events: [
        {
          id: 'design-review',
          dayId: 'day-17',
          time: '09:30',
          title: t('Lumen 导航评审', 'Lumen navigation review'),
          detail: t('Design systems · 45 分钟', 'Design systems · 45 min'),
          status: t('6 人参加', '6 attending'),
        },
        {
          id: 'customer',
          dayId: 'day-17',
          time: '14:00',
          title: t('Northstar 客户访谈', 'Northstar customer interview'),
          detail: t('Customer research · 60 分钟', 'Customer research · 60 min'),
        },
        {
          id: 'release',
          dayId: 'day-20',
          time: '16:30',
          title: t('2.9 发布检查', '2.9 release check'),
          detail: t('Release room · 30 分钟', 'Release room · 30 min'),
          status: t('必需', 'Required'),
        },
      ],
      listStrategy: paneScroll,
    },
    timeRange: {
      labels: {
        title: t('安排设计评审', 'Schedule design review'),
        detail: t('选择开始时间、结束时间或常用时长。', 'Choose a start, end, or common duration.'),
        start: t('开始', 'Start'),
        end: t('结束', 'End'),
        separator: t('至', 'to'),
        durationGroup: t('常用时长', 'Common durations'),
        confirm: (duration) => t(`确认 ${duration}`, `Confirm ${duration}`),
      },
      startOptions: ['09:00', '09:30', '10:00', '10:30', '11:00'].map((label) => ({
        id: label,
        label,
      })),
      endOptions: ['10:00', '10:30', '11:00', '11:30', '12:00'].map((label) => ({
        id: label,
        label,
      })),
      durationOptions: [
        { id: '30', label: t('30 分钟', '30 minutes') },
        { id: '45', label: t('45 分钟', '45 minutes') },
        { id: '60', label: t('1 小时', '1 hour') },
        { id: '90', label: t('1.5 小时', '1.5 hours') },
      ],
      initialStartId: '09:30',
      initialEndId: '10:30',
      initialDurationId: '60',
    },
    form: {
      labels: {
        title: t('创建客户工作坊', 'Create customer workshop'),
        detail: t(
          '安排会议、参与者和会前材料。',
          'Schedule the session, participants, and pre-read material.',
        ),
        name: t('会议名称', 'Session name'),
        date: t('日期', 'Date'),
        attendees: t('参与者', 'Attendees'),
        start: t('开始时间', 'Start time'),
        end: t('结束时间', 'End time'),
        attachment: t('会前材料', 'Pre-read attachment'),
        attachmentHint: t('PDF 或文档，最大 10 MB', 'PDF or document, up to 10 MB'),
        notes: t('主持人备注', 'Facilitator notes'),
        notesPlaceholder: t('目标、议程和需要准备的内容…', 'Goals, agenda, and preparation notes…'),
        addAttendee: t('添加参与者', 'Add attendee'),
        removeAttendee: (name) => t(`移除 ${name}`, `Remove ${name}`),
        emptyAttendees: t('还没有参与者', 'No attendees yet'),
        capacityReached: t('已达参与人数上限', 'Attendee limit reached'),
        schedule: t('安排工作坊', 'Schedule workshop'),
      },
      initialName: t('Northstar 旅程映射', 'Northstar journey mapping'),
      initialDate: '2026-09-28',
      initialStart: '13:00',
      initialEnd: '15:00',
      attendees: [
        { id: 'maya', name: 'Maya Chen', initials: 'MC' },
        { id: 'amara', name: 'Amara Okafor', initials: 'AO' },
        { id: 'jonah', name: 'Jonah Reed', initials: 'JR' },
        { id: 'theo', name: 'Theo Martin', initials: 'TM' },
      ],
      initialAttendeeIds: ['maya', 'amara'],
      maximumAttendees: 4,
      listStrategy: contentGrown,
    },
    deadline: {
      labels: {
        title: t('设置交付期限', 'Set delivery deadline'),
        detail: t(
          '选择快捷期限，或从日历和可用时段中精确选择。',
          'Choose a preset or select an exact calendar slot.',
        ),
        presets: t('期限快捷选项', 'Deadline presets'),
        calendar: t('期限日历', 'Deadline calendar'),
        slots: t('可用时段', 'Available slots'),
        emptySlots: t('当天没有可用时段', 'No available slots that day'),
      },
      monthLabel: t('2026 年 9 月', 'September 2026'),
      presets: [
        { id: 'today', label: t('今天', 'Today') },
        { id: 'tomorrow', label: t('明天', 'Tomorrow') },
        { id: 'week', label: t('本周五', 'This Friday') },
        { id: 'next', label: t('下周', 'Next week') },
      ],
      days: Array.from({ length: 14 }, (_, index) => {
        const septemberDay = index + 22;
        const month = septemberDay <= 30 ? 9 : 10;
        const day = month === 9 ? septemberDay : septemberDay - 30;
        return {
          id: `deadline-${month}-${day}`,
          label: String(day),
          dateLabel: t(`${month} 月 ${day} 日`, `${month === 9 ? 'September' : 'October'} ${day}`),
        };
      }),
      slots: [
        { id: 'noon', label: '12:00' },
        { id: 'eod', label: t('17:00 · 工作日结束', '17:00 · End of day') },
        { id: 'custom', label: t('23:59 · 当天结束', '23:59 · End of day') },
      ],
      initialPresetId: 'week',
      initialDayId: 'deadline-9-25',
      listStrategy: contentGrown,
    },
    availability: {
      labels: {
        title: t('每周可约时间', 'Weekly availability'),
        detail: t(
          '设置客户和团队可以预订的时间段。',
          'Set the windows customers and teammates can book.',
        ),
        unavailable: t('不可约', 'Unavailable'),
        enableDay: (day) => t(`切换 ${day}`, `Toggle ${day}`),
        start: (day) => t(`${day} 开始时间`, `${day} start time`),
        end: (day) => t(`${day} 结束时间`, `${day} end time`),
        separator: t('至', 'to'),
        addInterval: (day) => t(`为 ${day} 添加时段`, `Add interval for ${day}`),
        save: t('保存可约时间', 'Save availability'),
        empty: t('没有可配置日期', 'No days available'),
      },
      days: [
        {
          id: 'mon',
          label: t('周一', 'Monday'),
          initiallyEnabled: true,
          start: '09:00',
          end: '17:00',
        },
        {
          id: 'tue',
          label: t('周二', 'Tuesday'),
          initiallyEnabled: true,
          start: '09:00',
          end: '17:00',
        },
        {
          id: 'wed',
          label: t('周三', 'Wednesday'),
          initiallyEnabled: true,
          start: '10:00',
          end: '18:00',
        },
        {
          id: 'thu',
          label: t('周四', 'Thursday'),
          initiallyEnabled: true,
          start: '09:00',
          end: '17:00',
        },
        {
          id: 'fri',
          label: t('周五', 'Friday'),
          initiallyEnabled: false,
          start: '09:00',
          end: '15:00',
        },
        {
          id: 'sat',
          label: t('周六', 'Saturday'),
          initiallyEnabled: false,
          start: '10:00',
          end: '14:00',
        },
        {
          id: 'sun',
          label: t('周日', 'Sunday'),
          initiallyEnabled: false,
          start: '10:00',
          end: '14:00',
        },
      ],
      listStrategy: paneScroll,
    },
    timeline: {
      labels: {
        title: t('发布周日程', 'Release week schedule'),
        detail: t(
          '按天查看评审、冻结窗口和发布活动。',
          'Review meetings, freeze windows, and release events by day.',
        ),
        viewGroup: t('日程视图', 'Schedule view'),
        timeline: t('一周时间轴', 'Week timeline'),
        empty: t('没有日程', 'No scheduled events'),
      },
      views: [
        { id: 'week', label: t('周', 'Week') },
        { id: 'day', label: t('日', 'Day') },
        { id: 'agenda', label: t('议程', 'Agenda') },
      ],
      initialViewId: 'week',
      hours: ['09:00', '11:00', '13:00', '15:00', '17:00'].map((label) => ({ id: label, label })),
      days: [
        { id: 'mon', label: t('周一 21', 'Mon 21') },
        { id: 'tue', label: t('周二 22', 'Tue 22') },
        { id: 'wed', label: t('周三 23', 'Wed 23') },
        { id: 'thu', label: t('周四 24', 'Thu 24') },
        { id: 'fri', label: t('周五 25', 'Fri 25') },
      ],
      events: [
        {
          id: 'triage',
          dayId: 'mon',
          title: t('发布问题分流', 'Release issue triage'),
          time: '09:30–10:15',
          topPercent: 8,
          heightPercent: 18,
          tone: 'warning',
        },
        {
          id: 'design',
          dayId: 'tue',
          title: t('最终设计评审', 'Final design review'),
          time: '11:00–12:00',
          topPercent: 24,
          heightPercent: 22,
        },
        {
          id: 'freeze',
          dayId: 'wed',
          title: t('代码冻结', 'Code freeze'),
          time: '15:00',
          topPercent: 58,
          heightPercent: 14,
          tone: 'danger',
        },
        {
          id: 'release',
          dayId: 'thu',
          title: t('生产发布', 'Production release'),
          time: '13:00–14:30',
          topPercent: 42,
          heightPercent: 28,
          tone: 'success',
        },
        {
          id: 'retro',
          dayId: 'fri',
          title: t('发布复盘', 'Release retrospective'),
          time: '10:30–11:15',
          topPercent: 18,
          heightPercent: 18,
        },
      ],
      listStrategy: paneScroll,
    },
    booking: {
      labels: {
        title: t('预约产品咨询', 'Book a product consultation'),
        detail: t(
          '选择日期和时间，与 Lumen 解决方案团队交流。',
          'Choose a date and time with the Lumen solutions team.',
        ),
        days: t('可预约日期', 'Available days'),
        slots: (day) => t(`${day} 的可预约时间`, `Available times for ${day}`),
        emptyDays: t('没有可预约日期', 'No available days'),
        emptySlots: t('当天没有可预约时间', 'No available times that day'),
      },
      summary: {
        title: t('30 分钟产品咨询', '30-minute product consultation'),
        detail: t(
          '与解决方案架构师讨论自动化、治理和集成。',
          'Discuss automation, governance, and integrations with a solutions architect.',
        ),
        timezone: t('时区：新加坡时间 GMT+8', 'Time zone: Singapore GMT+8'),
        status: t('无需付费', 'Free consultation'),
      },
      days: [
        { id: 'sep-28', label: t('周一 28', 'Mon 28') },
        { id: 'sep-29', label: t('周二 29', 'Tue 29') },
        { id: 'sep-30', label: t('周三 30', 'Wed 30') },
        { id: 'oct-1', label: t('周四 1', 'Thu 1') },
      ],
      slots: [
        { id: '09-30', label: '09:30' },
        { id: '11-00', label: '11:00' },
        { id: '14-30', label: '14:30' },
        { id: '16-00', label: '16:00' },
      ],
      initialDayId: 'sep-29',
      listStrategy: contentGrown,
    },
  };
}
