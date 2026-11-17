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
#define maxn 500009

int n,nq; 
string s; 
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

struct matrix{
    int a[2][2] = {0}; 
    friend matrix operator * (const matrix &A, const matrix &B) {
    matrix res;
    res.a[0][0] = (1LL * A.a[0][0] * B.a[0][0] + 1LL * A.a[0][1] * B.a[1][0]) % mod;
    res.a[0][1] = (1LL * A.a[0][0] * B.a[0][1] + 1LL * A.a[0][1] * B.a[1][1]) % mod;
    res.a[1][0] = (1LL * A.a[1][0] * B.a[0][0] + 1LL * A.a[1][1] * B.a[1][0]) % mod;
    res.a[1][1] = (1LL * A.a[1][0] * B.a[0][1] + 1LL * A.a[1][1] * B.a[1][1]) % mod;
    return res;
    }
}; 

matrix I,A[3]; 
matrix T[maxn*4][3]; int lazy[maxn*4]; 

void prepare() 
{
    I.a[0][0] = I.a[1][1] = 1; 
    for (int i = 0; i < 3; i ++) 
    {
        int x = rng() % mod; 
        A[i].a[0][0] = x, A[i].a[0][1] = 1; 
        A[i].a[1][0] = (1-1ll*x*x%mod+mod)%mod; 
        A[i].a[1][1] = (mod-x); 
    }
}

void build (int id, int l, int r) 
{
    if (l == r) 
    {
        int f = s[l] - '0'; 
        for (int i = 0; i < 3; i ++) T[id][i] = A[(i+f)%3]; 
        return ; 
    }
    build (left,l,mid), build(right,mid+1,r); 
    for (int i = 0; i < 3; i ++) T[id][i] = T[left][i] * T[right][i]; 
}
matrix Temp[3]; 
void apply(int id, int k) 
{
    if (k == 1) {
        matrix tmp = T[id][0];
        T[id][0] = T[id][1];
        T[id][1] = T[id][2];
        T[id][2] = tmp;
    } else if (k == 2) {
        matrix tmp = T[id][2];
        T[id][2] = T[id][1];
        T[id][1] = T[id][0];
        T[id][0] = tmp;
    }
    lazy[id] += k;
    if (lazy[id] >= 3) lazy[id] -= 3; 
}
void down (int id) 
{
    int &t = lazy[id]; if (!t) return; 
    apply(left,t), apply(right,t);
    t = 0; 
}
void update (int id, int l, int r, int u, int v) 
{
    if (l > v || r < u) return; 
    if (u <= l && r <= v) { apply(id,1); return;}
    down (id); update(left,l,mid,u,v), update(right,mid+1,r,u,v); 
    for (int i = 0; i < 3; i ++) T[id][i] = T[left][i] * T[right][i]; 
}
matrix get (int id, int l, int r, int u, int v) 
{
    if (l > v || r < u) return I; 
    if (u <= l && r <= v) return T[id][0]; 
    down (id); 
    return get(left,l,mid,u,v)*get(right,mid+1,r,u,v); 
}
int main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> nq >> s; 
    s = ' ' + s; 
    
    prepare(); 
    build (1,1,n); 

    while (nq--) 
    {
        int type,l,r; cin >> type >> l >> r; 
        if (type == 1) update (1,1,n,l,r); 
        else 
        {
            matrix res = get(1,1,n,l,r); 
            bool ok = true; 
            for (int i = 0; i < 2; i ++) for (int j = 0; j < 2; j ++) if (res.a[i][j] != I.a[i][j]) ok = false;
            if (ok) cout << "Yes\n"; 
            else cout << "No\n"; 
        }
    }
    return 0;
}
