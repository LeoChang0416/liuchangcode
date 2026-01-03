const fs = require('fs');
const d = JSON.parse(fs.readFileSync('local_history.json')).data;
console.log('=== 本地后台数据统计 ===');
console.log('总记录数:', d.length);

const byStatus = {};
d.forEach(r => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });
console.log('\n按状态分布:');
Object.entries(byStatus).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

console.log('\n最近5条记录:');
d.slice(0,5).forEach((r,i) => {
  console.log(`${i+1}. [${r.status}] ID:${r.id.slice(0,8)}... 时间:${r.createdAt}`);
  if(r.status === 'submitted' || r.status === 'processing') {
    console.log(`   -> taskId: ${r.taskId}`);
  }
});

const stuck = d.filter(r => ['submitted','processing'].includes(r.status));
if(stuck.length > 0) {
  console.log('\n⚠️ 卡住的任务:');
  stuck.forEach(r => console.log(`  - ${r.id} (${r.status}) taskId:${r.taskId}`));
}

