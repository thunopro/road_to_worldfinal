#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009


struct point{
    int x,y,id; 
}; 
struct rect{
    int x1,x2,y1,y2,z,id; 
}; 
struct node{
    int x,y,id; 
    int minx,maxx,miny,maxy; 
    int Min,l,r,fa; 
};
point a[maxn]; 
rect b[maxn]; 
node T[maxn]; 

int n,m,root; 
int pos[maxn],answer[maxn]; 

void up (int u) 
{
    node &p = T[u]; 
    p.minx = p.maxx = p.x; 
    p.miny = p.maxy = p.y; 

    for (auto v : {p.l,p.r}) 
    {
        if (!v) continue; 
        chkmin(p.minx,T[v].minx), chkmax(p.maxx,T[v].maxx); 
        chkmin(p.miny,T[v].miny), chkmax(p.maxy,T[v].maxy); 
    }
}

int build (int l, int r, int d, int fa) 
{
    if (l > r) return 0; 
    nth_element(a+l,a+mid,a+r+1,[d](const point &a, const point &b)
        {
            if (d == 0) { return ((a.x != b.x) ? a.x < b.x : a.y < b.y);} 
            else if (d == 1) { return ((a.y != b.y) ? a.y < b.y : a.x < b.x);}
        });
    node &p = T[mid]; 
    p.x = a[mid].x, p.y = a[mid].y, p.id = p.Min = a[mid].id, p.fa = fa; 

    pos[p.id] = mid; 
    p.l = build(l,mid-1,d^1,mid), p.r = build(mid+1,r,d^1,mid); 

    up(mid); 

    if (p.l) chkmin (p.Min,T[p.l].Min); 
    if (p.r) chkmin (p.Min,T[p.r].Min); 

    return mid; 
}

void query(int u, const rect &q, int &answer) 
{
    if (!u || T[u].Min >= answer) return; 

    node &p = T[u]; 
    if (p.maxx < q.x1 || p.minx > q.x2 || p.maxy < q.y1 || p.miny > q.y2) return ; 
    if (q.x1 <= p.minx && p.maxx <= q.x2 && q.y1 <= p.miny && p.maxy <= q.y2) { chkmin (answer,p.Min); return;}

    if (q.x1 <= p.x && p.x <= q.x2 && q.y1 <= p.y && p.y <= q.y2) { chkmin(answer,p.id);}

    int l = p.l, r = p.r; 
    if (l && r && T[l].Min > T[r].Min) swap(l,r); 
    if (l) query(l,q,answer); 
    if (r) query(r,q,answer); 
}

void erase (int id) 
{
    int u = pos[id]; 
    T[u].id = INF; 
    while (u) 
    {
        node &p = T[u]; 
        p.Min = p.id; 
        if (p.l) chkmin (p.Min,T[p.l].Min); 
        if (p.r) chkmin (p.Min,T[p.r].Min); 
        u = p.fa; 
    }
}

signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0);

    cin >> n; 
    for (int i = 1; i <= n; i ++) 
    {
        int x1,x2,y1,y2,z; cin >> x1 >> x2 >> y1 >> y2 >> z; 
        b[i] = {x1,x2,y1,y2,z,i}; 
    }
    
    cin >> m; 
    for (int i = 1; i <= m; i ++) cin >> a[i].x >> a[i].y, a[i].id = i; 

    int root = build(1,m,0,0); 

    sort (b+1,b+n+1,[](const rect &a, const rect &b) { return a.z < b.z; }); 

    vi res(m+1,0); 

    for (int i = 1; i <= n; i ++) 
    {
        int answer = INF; 
        query(root,b[i],answer); 
        if (answer == INF) continue; 
        res[answer] = b[i].id; 
        erase(answer); 
    }

    for (int i = 1; i <= m; i ++) cout << res[i] << "\n"; 
    return 0;
}
