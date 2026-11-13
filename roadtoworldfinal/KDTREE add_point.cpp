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


struct node{
    int x,y,l,r,sz; 
    int minx, maxx,miny, maxy; 
} T[maxn]; 

int n,nq, root,num; 
int a[maxn], cnt; 

int min_1 = INF, max_1 = -INF, min_2 = INF, max_2 = -INF; 

void up (int u) 
{
    node &p = T[u]; 
    p.sz = 1, p.minx = p.maxx = p.x, p.miny = p.maxy = p.y; 

    for (auto v : {p.l,p.r}) 
    {
        if (!v) continue; 
        p.sz += T[v].sz; 
        chkmin (p.minx,T[v].minx), chkmax(p.maxx,T[v].maxx); 
        chkmin (p.miny,T[v].miny), chkmax(p.maxy,T[v].maxy); 
    }
}

void collect (int u) 
{
    if (!u) return ; 
    a[++cnt] = u; 
    collect(T[u].l), collect(T[u].r); 
}

int build (int l, int r, int d) 
{
    if (l > r) return 0; 
    nth_element(a+l,a+mid,a+r+1,[d] (int u, int v)
                {
                    if (d == 0) return T[u].x < T[v].x; 
                    else return T[u].y < T[v].y; 
                }); 

    int u = a[mid]; 
    T[u].l = build(l,mid-1,d^1), T[u].r = build(mid+1,r,d^1); 
    up (u); 
    return u; 
}

int insert (int u, int v, int d)
{
    if (!u) return v; 
    if ((d == 0 && T[v].x < T[u].x) || (d == 1 && T[v].y < T[u].y)) T[u].l = insert(T[u].l,v,d^1); 
    else T[u].r = insert(T[u].r,v,d^1); 
    up (u);  

    if (4*max(T[T[u].l].sz,T[T[u].r].sz) > 3*T[u].sz) 
    {
        cnt = 0; 
        collect(u); 
        u = build (1,cnt,d); 
    }
    return u; 
}

void add_point (int x, int y, bool init = false) 
{
    int u = ++ num; 
    T[u].x = x, T[u].y = y, T[u].sz = 1; 
    
    up(u); 
    // phase for max 
    chkmin(min_1,x+y), chkmax(max_1,x+y); 
    chkmin(min_2,x-y), chkmax(max_2,x-y); 

    if (init) a[u] = u; 
    else root = insert(root,u,0); 
}

int dist (int u, int x, int y) 
{
    if (!u) return INF; 
    node &p = T[u]; 
    int dx = max({0ll,p.minx-x,x-p.maxx}); 
    int dy = max({0ll,p.miny-y,y-p.maxy}); 
    return dx + dy; 
}

void query (int u, int x, int y, int &answer) 
{
    if (!u) return ; 
    node &p = T[u]; 

    chkmin (answer,abs(p.x-x)+abs(p.y-y)); 

    int l = p.l, r = p.r; 
    int dist_l = dist(l,x,y), dist_r = dist(r,x,y); 

    if (dist_l > dist_r) swap(dist_l,dist_r), swap(l,r); 
    if (dist_l < answer) query(l,x,y,answer); 
    if (dist_r < answer) query(r,x,y,answer); 
}

signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n; 
    for (int i = 1; i <= n; i ++) 
    {
        int x,y; cin >> x >> y; 
        add_point (x,y,1); 
    }

    root = build(1,num,0); 

    cin >> nq; 
    while (nq --) 
    {
        int type,x,y; cin >> type >> x >> y; 
        if (type == 0) add_point(x,y); 
        else if (type == 1) 
        {
            int answer = INF*2; 
            query(root,x,y,answer);
            cout << answer << "\n"; 
        }
        else 
        {
            int answer = 0;  
            int f1 = x+y, f2 = x-y; 
            answer = max({abs(f1-min_1),abs(f1-max_1),abs(f2-min_2),abs(f2-max_2)}); 
            cout << answer << "\n"; 
        }
    }
    return 0;
}
