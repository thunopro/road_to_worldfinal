#pragma GCC target("avx2")
#pragma GCC optimize("O3")
#pragma GCC optimize("unroll-loops")
#include<bits/stdc++.h>
using namespace std ; 
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
#define maxn 100009

int n,nq; 

pii a[maxn]; 

struct query{
    int pos; 
    string s; 
    int id; 
}; 
vector<query> event[21][21]; 
struct query1{
    string s; 
    int id; 
}; 
vector<query1> eventq[maxn]; 
int answer[maxn]; 
int id_after[maxn], id_prev[maxn]; 
unordered_map <ll,int> mp;

const int HASH_SIZE = 1<<20; 

int cnt = 0; 
int version = 1; 

int used[HASH_SIZE]; 

ll keys[HASH_SIZE]; 
int vals[HASH_SIZE],mark[HASH_SIZE]; 
int ind (int x, int y) 
{
    ll key = (1ll*x+(int)2e5) << 20 | (y+(int)2e5); 
    int h = ((key ^ (key >> 20)) * 11400714819323198485ULL) >> 44;
    while (mark[h] == version && keys[h] != key) h = (h+1)&(HASH_SIZE-1);
    if (mark[h] != version) 
    {
        mark[h] = version; 
        keys[h] = key; 
        vals[h] = ++ cnt; 
        used[cnt] = 0; 
    }
    return vals[h]; 
}
int res = 0; 
void update (int x,int w) 
{
    used[x] += w; 
    if (used[x] == 0 && w == -1) res --; 
    else if (used[x] == 1 && w == 1) res ++; 
}


int id_insert[maxn], cnt_insert = 0; 
int main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> nq; 
    for (int i = 1; i <= n; i ++) 
    {
        char c; cin >> c; 
        a[i] = a[i-1]; 
        if (c == 'U') a[i].fi ++; 
        else if (c == 'D') a[i].fi --; 
        else if (c == 'L') a[i].se --; 
        else if (c == 'R') a[i].se ++; 
    }
    for (int i = 1; i <= nq; i ++) 
    {
        int pos; string s; cin >> pos >> s; 
        int x = 0, y = 0; 
        for (auto c : s) 
        {
            if (c == 'U') x ++; else if (c == 'D') x --; 
            else if (c == 'L') y --; else if (c == 'R') y ++; 
        }
        event[x+10][y+10].pb({pos+1,s,i}); 
    }

    for (int offset_x = 0; offset_x <= 20; offset_x ++) for (int offset_y = 0; offset_y <= 20; offset_y ++) 
    {
        if (event[offset_x][offset_y].empty()) continue; 
        update(ind(0,0),1); 
        for (int i = 1; i <= n; i ++) 
        {
            id_after[i] = ind(a[i].fi+offset_x-10,a[i].se+offset_y-10);
            update(id_after[i],1);
            id_prev[i] = ind(a[i].fi,a[i].se);  
        }

        for (auto x : event[offset_x][offset_y]) eventq[x.pos].pb({x.s,x.id}); 

        for (int i = 1; i <= n+1; i ++) 
        {
            for (auto &[s,id] : eventq[i])
            {
                int x = a[i-1].fi, y = a[i-1].se; 
                cnt_insert = 0; 
                for (auto c : s) 
                {
                    if (c == 'U') x ++; else if (c == 'D') x --; 
                    else if (c == 'L') y --; else if (c == 'R') y ++; 
                    id_insert[++cnt_insert] = ind(x,y); 
                }
                for (int t = 1; t <= cnt_insert; t ++) update(id_insert[t],1); 
                answer[id] = res; 
                for (int t = 1; t <= cnt_insert; t ++) update(id_insert[t],-1); 
            }
            if (i == n+1) continue; 
            update(id_after[i],-1); 
            update(id_prev[i],1); 
        }
        
        for (auto q : event[offset_x][offset_y]) eventq[q.pos].clear(); 
        cnt = 0; 
        res = 0; 
        version ++; 
    }       

    for (int i = 1; i <= nq; i ++) cout << answer[i] << "\n"; 
    return 0;
}

