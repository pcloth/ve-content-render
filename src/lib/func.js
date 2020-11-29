// 制作一个不会重复的uid
export function uid() {
    let t = new Date().getTime();
    let r = Math.random(); 
    let r2 = Math.random(); 
    return `${t}${r}${r2}`
}